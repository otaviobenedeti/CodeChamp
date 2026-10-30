import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/app_session.dart';

class SessionStore {
  static const _tokenKey = 'codechamp_token';
  static const _userKey = 'codechamp_user';

  static Future<AppSession?> read() async {
    final preferences = await SharedPreferences.getInstance();
    final token = preferences.getString(_tokenKey);
    final userJson = preferences.getString(_userKey);
    if (token == null || userJson == null) return null;

    try {
      final decoded = jsonDecode(userJson);
      if (decoded is! Map<String, dynamic>) return null;
      return AppSession(token: token, user: UserProfile.fromJson(decoded));
    } on FormatException {
      await clear();
      return null;
    }
  }

  static Future<void> save(AppSession session) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(_tokenKey, session.token);
    await preferences.setString(_userKey, jsonEncode(session.user.toJson()));
  }

  static Future<void> clear() async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.remove(_tokenKey);
    await preferences.remove(_userKey);
  }
}
