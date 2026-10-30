import 'package:flutter/material.dart';

import '../models/app_session.dart';
import '../services/api_service.dart';
import '../theme.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key, required this.onAuthenticated});

  final Future<void> Function(AppSession session) onAuthenticated;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _api = ApiService();

  bool _isRegistering = false;
  bool _isLoading = false;
  bool _hidePassword = true;
  String? _feedback;
  bool _feedbackIsError = false;

  @override
  void dispose() {
    _nameController.dispose();
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _switchMode() {
    setState(() {
      _isRegistering = !_isRegistering;
      _passwordController.clear();
      _feedback = null;
    });
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _feedback = null;
    });

    try {
      final email = _emailController.text.trim();
      if (_isRegistering) {
        await _api.register(
          name: _nameController.text.trim(),
          username: _usernameController.text.trim(),
          email: email,
          password: _passwordController.text,
        );
        if (!mounted) return;
        setState(() {
          _isRegistering = false;
          _passwordController.clear();
          _feedback = 'Conta criada. Entre com seu e-mail e senha.';
          _feedbackIsError = false;
        });
      } else {
        final session = await _api.login(
          email: email,
          password: _passwordController.text,
        );
        await widget.onAuthenticated(session);
      }
    } on ApiException catch (error) {
      if (mounted) {
        setState(() {
          _feedback = error.message;
          _feedbackIsError = true;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _feedback = 'Não foi possível salvar sua sessão. Tente novamente.';
          _feedbackIsError = true;
        });
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                children: [
                  _buildBrand(),
                  const SizedBox(height: 32),
                  _buildFormCard(),
                  const SizedBox(height: 20),
                  Text(
                    'Aprenda programação com desafios',
                    style: TextStyle(
                      color: champMuted.withValues(alpha: 0.8),
                      fontSize: 13,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBrand() => Column(
    children: [
      Container(
        width: 76,
        height: 76,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: const LinearGradient(
            colors: [champPurple, champPurpleLight],
          ),
          border: Border.all(
            color: champGold.withValues(alpha: 0.7),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: champPurple.withValues(alpha: 0.35),
              blurRadius: 28,
            ),
          ],
        ),
        child: const Icon(
          Icons.emoji_events_rounded,
          color: champGold,
          size: 38,
        ),
      ),
      const SizedBox(height: 14),
      const Text(
        'CodeChamp',
        style: TextStyle(
          color: champGold,
          fontSize: 29,
          fontWeight: FontWeight.w900,
        ),
      ),
      const SizedBox(height: 5),
      Text(
        'SUA PRÓXIMA FASE COMEÇA AQUI',
        style: TextStyle(
          color: champMuted.withValues(alpha: 0.88),
          fontSize: 10,
          letterSpacing: 1.8,
          fontWeight: FontWeight.w700,
        ),
      ),
    ],
  );

  Widget _buildFormCard() => Container(
    padding: const EdgeInsets.fromLTRB(22, 24, 22, 20),
    decoration: BoxDecoration(
      color: champSurface,
      borderRadius: BorderRadius.circular(22),
      border: Border.all(color: champPurpleLight.withValues(alpha: 0.55)),
      boxShadow: [
        BoxShadow(
          color: champPurple.withValues(alpha: 0.14),
          blurRadius: 30,
          offset: const Offset(0, 14),
        ),
      ],
    ),
    child: Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            _isRegistering ? 'Criar conta' : 'Bem-vindo de volta',
            style: const TextStyle(
              color: champText,
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            _isRegistering
                ? 'Cadastre-se para acessar suas aulas.'
                : 'Entre para continuar aprendendo.',
            style: const TextStyle(color: champMuted, fontSize: 13),
          ),
          const SizedBox(height: 22),
          if (_isRegistering) ...[
            _input(
              controller: _nameController,
              label: 'Nome completo',
              icon: Icons.person_outline_rounded,
              validator: (value) => _required(value, 'Informe seu nome.'),
              textCapitalization: TextCapitalization.words,
              autofillHints: const [AutofillHints.name],
            ),
            const SizedBox(height: 13),
            _input(
              controller: _usernameController,
              label: 'Nome de usuário',
              icon: Icons.alternate_email_rounded,
              validator: (value) =>
                  _required(value, 'Informe um nome de usuário.'),
              autofillHints: const [AutofillHints.newUsername],
            ),
            const SizedBox(height: 13),
          ],
          _input(
            controller: _emailController,
            label: 'E-mail',
            icon: Icons.mail_outline_rounded,
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              final error = _required(value, 'Informe seu e-mail.');
              if (error != null) return error;
              if (!value!.trim().contains('@')) {
                return 'Digite um e-mail válido.';
              }
              return null;
            },
            autofillHints: const [AutofillHints.email],
          ),
          const SizedBox(height: 13),
          _input(
            controller: _passwordController,
            label: 'Senha',
            icon: Icons.lock_outline_rounded,
            obscureText: _hidePassword,
            autofillHints: [
              _isRegistering
                  ? AutofillHints.newPassword
                  : AutofillHints.password,
            ],
            validator: (value) => _required(value, 'Informe sua senha.'),
            suffixIcon: IconButton(
              onPressed: () => setState(() => _hidePassword = !_hidePassword),
              icon: Icon(
                _hidePassword
                    ? Icons.visibility_outlined
                    : Icons.visibility_off_outlined,
              ),
              color: champMuted,
            ),
            onFieldSubmitted: (_) => _submit(),
          ),
          if (_feedback != null) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: (_feedbackIsError ? const Color(0xFFFF3B6B) : champGold)
                    .withValues(alpha: 0.10),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color:
                      (_feedbackIsError ? const Color(0xFFFF3B6B) : champGold)
                          .withValues(alpha: 0.35),
                ),
              ),
              child: Text(
                _feedback!,
                style: TextStyle(
                  color: _feedbackIsError ? const Color(0xFFFF8CA7) : champGold,
                  fontSize: 13,
                ),
              ),
            ),
          ],
          const SizedBox(height: 20),
          SizedBox(
            height: 52,
            child: FilledButton(
              onPressed: _isLoading ? null : _submit,
              style: FilledButton.styleFrom(
                backgroundColor: champGold,
                foregroundColor: champBackground,
                disabledBackgroundColor: champGold.withValues(alpha: 0.6),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                textStyle: const TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 15,
                ),
              ),
              child: _isLoading
                  ? const SizedBox.square(
                      dimension: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.4,
                        color: champBackground,
                      ),
                    )
                  : Text(_isRegistering ? 'CRIAR CONTA' : 'ENTRAR'),
            ),
          ),
          const SizedBox(height: 14),
          TextButton(
            onPressed: _isLoading ? null : _switchMode,
            child: Text(
              _isRegistering
                  ? 'Já tem uma conta? Entrar'
                  : 'Ainda não tem conta? Cadastre-se',
              style: const TextStyle(
                color: champText,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    ),
  );

  Widget _input({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    String? Function(String?)? validator,
    TextInputType? keyboardType,
    TextCapitalization textCapitalization = TextCapitalization.none,
    bool obscureText = false,
    List<String>? autofillHints,
    Widget? suffixIcon,
    void Function(String)? onFieldSubmitted,
  }) => TextFormField(
    controller: controller,
    validator: validator,
    keyboardType: keyboardType,
    textCapitalization: textCapitalization,
    obscureText: obscureText,
    autofillHints: autofillHints,
    onFieldSubmitted: onFieldSubmitted,
    style: const TextStyle(color: champText),
    decoration: InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon),
      suffixIcon: suffixIcon,
    ),
  );

  String? _required(String? value, String message) =>
      value == null || value.trim().isEmpty ? message : null;
}
