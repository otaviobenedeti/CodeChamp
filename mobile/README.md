# CodeChamp Mobile

Versão reduzida do CodeChamp em Flutter: cadastro, login e consulta das aulas cadastradas no sistema.

## Requisitos

- Flutter instalado
- Backend CodeChamp em execução na porta `3000`
- Emulador Android/iOS ou aparelho conectado

## Executar

Na raiz deste diretório:

```sh
flutter pub get
flutter run
```

O app usa `http://10.0.2.2:3000` no emulador Android e `http://localhost:3000` nas demais plataformas locais.

Para testar em um aparelho físico, informe o endereço IP do computador na mesma rede que executa o backend:

```sh
flutter run --dart-define=API_BASE_URL=http://192.168.0.10:3000
```

Troque `192.168.0.10` pelo IP local do computador. A listagem usa `GET /lesson/listar` com o token Bearer retornado por `POST /auth/login`. O cadastro usa `POST /auth/register`; depois de cadastrar, o usuário entra com suas credenciais.
