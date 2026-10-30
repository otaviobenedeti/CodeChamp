import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../models/app_session.dart';
import '../models/lesson.dart';
import '../services/api_service.dart';
import '../theme.dart';

class LessonsScreen extends StatefulWidget {
  const LessonsScreen({
    super.key,
    required this.session,
    required this.onSignedOut,
  });

  final AppSession session;
  final Future<void> Function() onSignedOut;

  @override
  State<LessonsScreen> createState() => _LessonsScreenState();
}

class _LessonsScreenState extends State<LessonsScreen> {
  final _api = ApiService();
  final _searchController = TextEditingController();
  late Future<List<Lesson>> _lessonsFuture;
  String _search = '';

  @override
  void initState() {
    super.initState();
    _lessonsFuture = _fetchLessons();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<List<Lesson>> _fetchLessons() async {
    try {
      return await _api.listLessons(widget.session.token);
    } on ApiException catch (error) {
      if (error.statusCode == 401) await widget.onSignedOut();
      rethrow;
    }
  }

  Future<void> _refresh() async {
    final next = _fetchLessons();
    setState(() => _lessonsFuture = next);
    try {
      await next;
    } catch (_) {
      // The FutureBuilder displays the API error and its retry action.
    }
  }

  @override
  Widget build(BuildContext context) {
    final firstName = widget.session.user.name
        .trim()
        .split(RegExp(r'\s+'))
        .first;
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 20,
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.emoji_events_rounded, color: champGold, size: 25),
            SizedBox(width: 9),
            Text(
              'CodeChamp',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 19),
            ),
          ],
        ),
        actions: [
          PopupMenuButton<String>(
            tooltip: 'Conta',
            icon: CircleAvatar(
              radius: 17,
              backgroundColor: champPurple,
              child: Text(
                firstName.isEmpty
                    ? 'C'
                    : firstName.characters.first.toUpperCase(),
                style: const TextStyle(
                  color: champGold,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            onSelected: (value) async {
              if (value == 'logout') await widget.onSignedOut();
            },
            itemBuilder: (context) => [
              PopupMenuItem<String>(
                enabled: false,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.session.user.name,
                      style: const TextStyle(
                        color: champText,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      widget.session.user.email,
                      style: const TextStyle(color: champMuted, fontSize: 12),
                    ),
                  ],
                ),
              ),
              const PopupMenuDivider(),
              const PopupMenuItem<String>(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(
                      Icons.logout_rounded,
                      size: 19,
                      color: Color(0xFFFF8CA7),
                    ),
                    SizedBox(width: 10),
                    Text('Sair'),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 22, 20, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Olá, $firstName 👋',
                style: const TextStyle(
                  color: champGold,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Aulas disponíveis',
                style: TextStyle(
                  color: champText,
                  fontSize: 27,
                  fontWeight: FontWeight.w900,
                  height: 1.1,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Conteúdos cadastrados no CodeChamp',
                style: TextStyle(color: champMuted, fontSize: 13),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _searchController,
                onChanged: (value) =>
                    setState(() => _search = value.trim().toLowerCase()),
                style: const TextStyle(color: champText),
                decoration: InputDecoration(
                  hintText: 'Buscar aula ou linguagem',
                  prefixIcon: const Icon(Icons.search_rounded),
                  suffixIcon: _search.isEmpty
                      ? null
                      : IconButton(
                          tooltip: 'Limpar busca',
                          icon: const Icon(Icons.close_rounded),
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _search = '');
                          },
                        ),
                ),
              ),
              const SizedBox(height: 14),
              Expanded(
                child: FutureBuilder<List<Lesson>>(
                  future: _lessonsFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting &&
                        !snapshot.hasData) {
                      return const Center(
                        child: CircularProgressIndicator(
                          color: champGold,
                          strokeWidth: 2.5,
                        ),
                      );
                    }
                    if (snapshot.hasError) {
                      final message = snapshot.error is ApiException
                          ? (snapshot.error as ApiException).message
                          : 'Não foi possível carregar as aulas.';
                      return _MessageState(
                        icon: Icons.cloud_off_rounded,
                        title: 'Falha ao carregar',
                        message: message,
                        actionLabel: 'Tentar novamente',
                        onAction: _refresh,
                      );
                    }

                    final lessons = (snapshot.data ?? const <Lesson>[]).where((
                      lesson,
                    ) {
                      if (_search.isEmpty) return true;
                      return lesson.title.toLowerCase().contains(_search) ||
                          lesson.language.toLowerCase().contains(_search) ||
                          (lesson.description?.toLowerCase().contains(
                                _search,
                              ) ??
                              false);
                    }).toList();

                    if (lessons.isEmpty) {
                      return _MessageState(
                        icon: _search.isEmpty
                            ? Icons.video_library_outlined
                            : Icons.search_off_rounded,
                        title: _search.isEmpty
                            ? 'Nenhuma aula cadastrada'
                            : 'Nenhum resultado',
                        message: _search.isEmpty
                            ? 'As aulas aparecerão aqui quando forem cadastradas no sistema.'
                            : 'Tente buscar por outro nome ou linguagem.',
                        actionLabel: _search.isEmpty ? null : 'Limpar busca',
                        onAction: _search.isEmpty
                            ? null
                            : () {
                                _searchController.clear();
                                setState(() => _search = '');
                              },
                      );
                    }

                    return RefreshIndicator(
                      color: champGold,
                      backgroundColor: champSurface,
                      onRefresh: _refresh,
                      child: ListView.separated(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.only(bottom: 24),
                        itemCount: lessons.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 12),
                        itemBuilder: (context, index) => _LessonCard(
                          lesson: lessons[index],
                          onTap: () => _showLesson(lessons[index]),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _showLesson(Lesson lesson) async {
    await showModalBottomSheet<void>(
      context: context,
      useSafeArea: true,
      isScrollControlled: true,
      backgroundColor: champSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => _LessonDetails(lesson: lesson),
    );
  }
}

class _LessonCard extends StatelessWidget {
  const _LessonCard({required this.lesson, required this.onTap});

  final Lesson lesson;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final accent = _languageColor(lesson.language);
    return Material(
      color: champSurface,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: champPurple.withValues(alpha: 0.62)),
          ),
          child: Row(
            children: [
              Container(
                width: 55,
                height: 55,
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(color: accent.withValues(alpha: 0.3)),
                ),
                child: Icon(
                  _languageIcon(lesson.language),
                  color: accent,
                  size: 26,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      lesson.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: champText,
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 7,
                      runSpacing: 5,
                      children: [
                        _Tag(text: lesson.language, color: accent),
                        if (lesson.difficulty != null &&
                            lesson.difficulty!.isNotEmpty)
                          _Tag(
                            text: _difficultyLabel(lesson.difficulty!),
                            color: champMuted,
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 5),
              const Icon(
                Icons.chevron_right_rounded,
                color: champMuted,
                size: 23,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _LessonDetails extends StatelessWidget {
  const _LessonDetails({required this.lesson});

  final Lesson lesson;

  @override
  Widget build(BuildContext context) {
    final accent = _languageColor(lesson.language);
    final uri = Uri.tryParse(lesson.youtubeUrl);
    final hasUrl =
        uri != null && (uri.scheme == 'http' || uri.scheme == 'https');
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(22, 12, 22, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Center(
            child: Container(
              width: 38,
              height: 4,
              decoration: BoxDecoration(
                color: champPurpleLight,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
          const SizedBox(height: 22),
          Row(
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: accent.withValues(alpha: 0.14),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Icon(
                  _languageIcon(lesson.language),
                  color: accent,
                  size: 27,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: _Tag(text: lesson.language, color: accent),
              ),
              if (lesson.difficulty != null && lesson.difficulty!.isNotEmpty)
                _Tag(
                  text: _difficultyLabel(lesson.difficulty!),
                  color: champMuted,
                ),
            ],
          ),
          const SizedBox(height: 18),
          Text(
            lesson.title,
            style: const TextStyle(
              color: champText,
              fontSize: 23,
              fontWeight: FontWeight.w900,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            (lesson.description?.trim().isNotEmpty ?? false)
                ? lesson.description!.trim()
                : 'Não há uma descrição disponível para esta aula.',
            style: const TextStyle(
              color: champMuted,
              height: 1.55,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 23),
          FilledButton.icon(
            onPressed: hasUrl
                ? () async {
                    final opened = await launchUrl(
                      uri,
                      mode: LaunchMode.externalApplication,
                    );
                    if (!opened && context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                            'Não foi possível abrir o link da aula.',
                          ),
                        ),
                      );
                    }
                  }
                : null,
            icon: const Icon(Icons.play_arrow_rounded),
            label: const Text('Assistir aula no YouTube'),
            style: FilledButton.styleFrom(
              backgroundColor: champGold,
              foregroundColor: champBackground,
              disabledBackgroundColor: champPurple.withValues(alpha: 0.45),
              disabledForegroundColor: champMuted,
              padding: const EdgeInsets.symmetric(vertical: 15),
              textStyle: const TextStyle(fontWeight: FontWeight.w800),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  const _Tag({required this.text, required this.color});

  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
    decoration: BoxDecoration(
      color: color.withValues(alpha: 0.10),
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: color.withValues(alpha: 0.28)),
    ),
    child: Text(
      text,
      style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w800),
    ),
  );
}

class _MessageState extends StatelessWidget {
  const _MessageState({
    required this.icon,
    required this.title,
    required this.message,
    this.actionLabel,
    this.onAction,
  });

  final IconData icon;
  final String title;
  final String message;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) => Center(
    child: SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 30),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: champPurpleLight, size: 50),
            const SizedBox(height: 15),
            Text(
              title,
              style: const TextStyle(
                color: champText,
                fontSize: 17,
                fontWeight: FontWeight.w800,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 7),
            Text(
              message,
              style: const TextStyle(
                color: champMuted,
                height: 1.45,
                fontSize: 13,
              ),
              textAlign: TextAlign.center,
            ),
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: 18),
              OutlinedButton(onPressed: onAction, child: Text(actionLabel!)),
            ],
          ],
        ),
      ),
    ),
  );
}

Color _languageColor(String language) {
  final value = language.toLowerCase();
  if (value.contains('javascript') || value == 'js') return champGold;
  if (value.contains('front')) return const Color(0xFF4B8CFF);
  if (value.contains('back')) return const Color(0xFF3DFF7A);
  if (value.contains('c++') || value.contains('cpp')) {
    return const Color(0xFFFF3B6B);
  }
  if (value.contains('python')) return const Color(0xFF56B4D3);
  return champPurpleLight;
}

IconData _languageIcon(String language) {
  final value = language.toLowerCase();
  if (value.contains('python')) return Icons.data_object_rounded;
  if (value.contains('front')) return Icons.web_rounded;
  if (value.contains('back')) return Icons.dns_rounded;
  if (value.contains('c++') || value.contains('cpp')) {
    return Icons.memory_rounded;
  }
  return Icons.code_rounded;
}

String _difficultyLabel(String difficulty) {
  switch (difficulty.toUpperCase()) {
    case 'EASY':
      return 'Fácil';
    case 'MEDIUM':
      return 'Médio';
    case 'HARD':
      return 'Avançado';
    default:
      return difficulty;
  }
}
