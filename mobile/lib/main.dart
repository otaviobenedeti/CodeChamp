import 'package:flutter/material.dart';

import 'models/app_session.dart';
import 'screens/auth_screen.dart';
import 'screens/lessons_screen.dart';
import 'services/session_store.dart';
import 'theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final session = await SessionStore.read();
  runApp(CodeChampApp(initialSession: session));
}

class CodeChampApp extends StatefulWidget {
  const CodeChampApp({super.key, required this.initialSession});

  final AppSession? initialSession;

  @override
  State<CodeChampApp> createState() => _CodeChampAppState();
}

class _CodeChampAppState extends State<CodeChampApp> {
  AppSession? _session;

  @override
  void initState() {
    super.initState();
    _session = widget.initialSession;
  }

  Future<void> _onAuthenticated(AppSession session) async {
    await SessionStore.save(session);
    if (mounted) setState(() => _session = session);
  }

  Future<void> _onSignedOut() async {
    await SessionStore.clear();
    if (mounted) setState(() => _session = null);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CodeChamp',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: champBackground,
        colorScheme: const ColorScheme.dark(
          primary: champGold,
          onPrimary: champBackground,
          secondary: champPurpleLight,
          surface: champSurface,
          onSurface: champText,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: champSurface,
          foregroundColor: champText,
          elevation: 0,
          centerTitle: false,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: champBackground,
          hintStyle: const TextStyle(color: champMuted),
          labelStyle: const TextStyle(color: champMuted),
          prefixIconColor: champMuted,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: champPurple),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: champPurple),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: champGold, width: 1.5),
          ),
        ),
        snackBarTheme: SnackBarThemeData(
          backgroundColor: champSurface,
          contentTextStyle: const TextStyle(color: champText),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      home: _session == null
          ? AuthScreen(onAuthenticated: _onAuthenticated)
          : LessonsScreen(session: _session!, onSignedOut: _onSignedOut),
    );
  }
}
