# Changelog

Todas as alterações relevantes do projeto **Master Seguros** estão documentadas neste arquivo.

O formato segue, de modo simplificado, o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
e o versionamento [SemVer](https://semver.org/lang/pt-BR/).

---

## [Não lançado] — branch `develop`

### Adicionado
- Arquivo `CHANGELOG.md` para registro do histórico de evolução do projeto.

---

## [1.0.0] — Lançamento inicial — branch `main`

### Adicionado
- **Estrutura inicial** do projeto com `README.md` e `.gitignore`.
- **Identidade visual** completa: logo/logomarca, slogan e paleta azul-marinho + dourado.
- **Imagens da marca**: hero da família protegida e fotos do carrossel (situações de seguro e sinistro).
- **Landing page (`index.html`)** com todas as seções:
  - Header com menu, dropdown de seguros e navegação mobile.
  - Carrossel de imagens, serviços, estatísticas e parceiros.
  - Hero estilo app, diferenciais e "como funciona".
  - Depoimentos, formulário de cadastro, FAQ, CTA e rodapé.
- **Estilo (`style.css`)** com gradientes, degradês, tipografia (Playfair Display + Inter),
  animações e layout totalmente responsivo.
- **Interatividade (`script.js`)**:
  - Carrossel com autoplay, efeito Ken Burns, swipe, dots e barra de progresso.
  - Formulário de cupom de inauguração com validação completa (nome, data de nascimento,
    cidade, telefone, e-mail e endereço), máscara de telefone e estado de sucesso com cupom copiável.
  - Contadores animados, reveal on scroll, countdown de inauguração, barra de progresso
    de rolagem e botão flutuante de WhatsApp.

### Ajustado
- Hero reformulado com estética de aplicativo: painel interativo, seletor rápido de coberturas e tilt 3D.
- Centralização e responsividade da página principal no mobile.
- Enquadramento e alinhamento da foto da família no card do hero.
- Reorganização da ordem das seções da página.

### Corrigido
- Menu hambúrguer no mobile: removido o efeito fosco (blur) que reduzia a legibilidade
  e corrigida a exibição dos itens, agora com links diretos para cada seguro.
