class Lesson {
  const Lesson({
    required this.id,
    required this.title,
    required this.language,
    required this.youtubeUrl,
    this.description,
    this.difficulty,
    this.status = 'PUBLISHED',
    this.order = 0,
  });

  final String id;
  final String title;
  final String language;
  final String youtubeUrl;
  final String? description;
  final String? difficulty;
  final String status;
  final int order;

  factory Lesson.fromJson(Map<String, dynamic> json) => Lesson(
    id: json['id']?.toString() ?? '',
    title: json['title']?.toString() ?? 'Aula sem título',
    language: json['language']?.toString() ?? 'Programação',
    youtubeUrl: json['youtubeUrl']?.toString() ?? '',
    description: json['description']?.toString(),
    difficulty: json['difficulty']?.toString(),
    status: json['status']?.toString() ?? 'PUBLISHED',
    order: int.tryParse(json['order']?.toString() ?? '') ?? 0,
  );
}
