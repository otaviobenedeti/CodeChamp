import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import '../models/app_session.dart';
import '../models/lesson.dart';

class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class ApiService {
  ApiService({http.Client? client})
    : _client = client ?? http.Client(),
      baseUrl = _resolveBaseUrl();

  final http.Client _client;
  final String baseUrl;

  static String _resolveBaseUrl() {
    const configured = String.fromEnvironment('API_BASE_URL');
    if (configured.isNotEmpty) {
      return configured.replaceFirst(RegExp(r'/$'), '');
    }

    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:3000';
    }
    return 'http://localhost:3000';
  }

  Uri _uri(String path) => Uri.parse('$baseUrl$path');

  Future<AppSession> login({
    required String email,
    required String password,
  }) async {
    final data = await _send(
      'POST',
      '/auth/login',
      body: {'email': email, 'password': password},
    );
    final userJson = data['user'];
    if (data['token'] is! String || userJson is! Map<String, dynamic>) {
      throw const ApiException('A resposta de login do servidor é inválida.');
    }
    return AppSession(
      token: data['token'] as String,
      user: UserProfile.fromJson(userJson),
    );
  }

  Future<void> register({
    required String name,
    required String username,
    required String email,
    required String password,
  }) async {
    await _send(
      'POST',
      '/auth/register',
      body: {
        'name': name,
        'username': username,
        'email': email,
        'password': password,
      },
    );
  }

  Future<List<Lesson>> listLessons(String token) async {
    try {
      final response = await _client
          .get(_uri('/lesson/listar'), headers: _headers(token: token))
          .timeout(const Duration(seconds: 20));

      final decoded = _decodeResponse(response);
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw ApiException(
          _errorMessage(decoded, 'Não foi possível carregar as aulas.'),
          statusCode: response.statusCode,
        );
      }
      if (decoded is! List) {
        throw const ApiException(
          'O servidor retornou uma lista de aulas inválida.',
        );
      }
      return decoded
          .whereType<Map<String, dynamic>>()
          .map(Lesson.fromJson)
          .toList()
        ..sort((a, b) => a.order.compareTo(b.order));
    } on ApiException {
      rethrow;
    } on TimeoutException {
      throw const ApiException(
        'O servidor demorou para responder. Tente novamente.',
      );
    } on http.ClientException {
      throw const ApiException(
        'Não foi possível conectar ao servidor. Confira o endereço da API e tente novamente.',
      );
    } catch (_) {
      throw const ApiException('Não foi possível carregar as aulas.');
    }
  }

  Future<Map<String, dynamic>> _send(
    String method,
    String path, {
    Map<String, dynamic>? body,
  }) async {
    try {
      final uri = _uri(path);
      final headers = _headers();
      late final http.Response response;
      if (method == 'POST') {
        response = await _client
            .post(uri, headers: headers, body: jsonEncode(body))
            .timeout(const Duration(seconds: 20));
      } else {
        throw const ApiException('Método de API não suportado.');
      }

      final decoded = _decodeResponse(response);
      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw ApiException(
          _errorMessage(decoded, 'Não foi possível concluir a solicitação.'),
          statusCode: response.statusCode,
        );
      }
      if (decoded is! Map<String, dynamic>) {
        throw const ApiException('O servidor retornou uma resposta inválida.');
      }
      return decoded;
    } on ApiException {
      rethrow;
    } on TimeoutException {
      throw const ApiException(
        'O servidor demorou para responder. Tente novamente.',
      );
    } on http.ClientException {
      throw const ApiException(
        'Não foi possível conectar ao servidor. Confira o endereço da API e tente novamente.',
      );
    } on PlatformException {
      throw const ApiException('Não foi possível conectar à API CodeChamp.');
    } catch (_) {
      throw const ApiException(
        'Não foi possível conectar ao servidor. Confira o endereço da API e tente novamente.',
      );
    }
  }

  Map<String, String> _headers({String? token}) => {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };

  dynamic _decodeResponse(http.Response response) {
    if (response.bodyBytes.isEmpty) return <String, dynamic>{};
    try {
      return jsonDecode(utf8.decode(response.bodyBytes));
    } on FormatException {
      throw ApiException(
        'O servidor retornou uma resposta inválida (HTTP ${response.statusCode}).',
        statusCode: response.statusCode,
      );
    }
  }

  String _errorMessage(dynamic decoded, String fallback) {
    if (decoded is Map<String, dynamic>) {
      final message =
          decoded['message'] ?? decoded['erro'] ?? decoded['mensagem'];
      if (message is String && message.trim().isNotEmpty) return message;
    }
    return fallback;
  }
}
