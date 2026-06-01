# gunslol — perfis pessoal

Site de perfil estilo [guns.lol](https://guns.lol), com Next.js 16, avatares Discord, atividade em tempo real, skins Roblox e player de música.

## Requisitos

- Node.js **20+** (recomendado)
- Conta no [GitHub](https://github.com)
- Conta na [Vercel](https://vercel.com) (deploy grátis)
- Bot no [Discord Developer Portal](https://discord.com/developers/applications)

## Rodar localmente

```bash
npm install
cp .env.example .env
# Edite .env e coloque DISCORD_BOT_TOKEN e DISCORD_GUILD_ID
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `DISCORD_BOT_TOKEN` | Sim* | Token do bot Discord |
| `DISCORD_GUILD_ID` | Recomendado | ID do servidor (DDLG) |
| `NEXT_PUBLIC_BACKGROUND_VIDEO_URL` | Não | URL externa do vídeo de fundo (se o MP4 for muito grande para o Git) |

\* Sem token, avatares e atividade usam fallback limitado.

Copie `.env.example` para `.env` e **nunca** commite o `.env`.

## Subir no GitHub

### 1. Vídeo de fundo (importante)

O arquivo `public/abstract-waves.mp4` tem ~**287 MB**. O GitHub bloqueia arquivos acima de **100 MB** sem [Git LFS](https://git-lfs.github.com/).

**Opção A — Git LFS (recomendado para manter o vídeo no repo):**

```bash
git lfs install
git add .gitattributes
git add public/abstract-waves.mp4
```

**Opção B — Vídeo hospedado fora (sem LFS):**

1. Suba o `.mp4` em um CDN (Cloudinary, Bunny, etc.)
2. Na Vercel, adicione: `NEXT_PUBLIC_BACKGROUND_VIDEO_URL=https://.../seu-video.mp4`
3. Remova ou não commite `public/abstract-waves.mp4`

### 2. Criar o repositório

```bash
git init
git add .
git commit -m "feat: site de perfil guns.lol"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

Arquivos ignorados automaticamente: `.env`, `node_modules`, `.next`, MP3/MP4 na raiz do projeto.

## Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. **Import** o repositório do GitHub
3. Framework: **Next.js** (detectado automaticamente)
4. Em **Environment Variables**, adicione:
   - `DISCORD_BOT_TOKEN` = seu token
   - `DISCORD_GUILD_ID` = ID do servidor
   - (opcional) `NEXT_PUBLIC_BACKGROUND_VIDEO_URL` = URL do vídeo
5. Clique em **Deploy**

O arquivo `vercel.json` já define região `gru1` (Brasil) e timeout de 30s nas APIs Discord.

### Discord na Vercel

- **Avatares** (`/api/discord/avatar/...`) funcionam bem (REST).
- **Atividade** (`/api/discord/presence/...`) usa `discord.js` com conexão persistente; em serverless pode haver cold start e atraso na primeira carga. Mantenha o bot no mesmo servidor dos usuários.

### Intents do bot (Developer Portal)

- **Presence Intent**
- **Server Members Intent**

## Build de produção (testar antes do deploy)

```bash
npm run build
npm start
```

## Estrutura do projeto

```
src/
  app/              # páginas e rotas API
  components/       # UI (perfis, player, fundo)
  lib/
    config.ts       # usuários, links, música, vídeo
    discord.ts      # API avatar
    discord-presence.ts
    roblox.ts
public/
  abstract-waves.mp4   # fundo (Git LFS se >100MB)
  music/               # faixa do player
```

## Personalizar

Edite `src/lib/config.ts` — nomes, Discord IDs, Roblox, links sociais, capa e música.

## Licença

Projeto privado / uso pessoal.
