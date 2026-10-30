class UserProfile {
  const UserProfile({
    required this.id,
    required this.name,
    required this.username,
    required this.email,
    this.role = 'USER',
  });

  final String id;
  final String name;
  final String username;
  final String email;
  final String role;

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    id: json['id']?.toString() ?? '',
    name: json['name']?.toString() ?? 'CodeChamp',
    username: json['username']?.toString() ?? '',
    email: json['email']?.toString() ?? '',
    role: json['role']?.toString() ?? 'USER',
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'username': username,
    'email': email,
    'role': role,
  };
}

class AppSession {
  const AppSession({required this.token, required this.user});

  final String token;
  final UserProfile user;
}
