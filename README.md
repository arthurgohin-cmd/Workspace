# Claude Code — Skills Workflow

Installation reproductible de 5 skills GitHub pour Claude Code, avec configuration
prête à l'emploi (hooks, statusline, permissions).

## Skills installés

| Skill | Source | Rôle |
|-------|--------|------|
| **caveman** (+ commit / review / help / compress) | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Mode ultra-condensé (−65 % de tokens en sortie) |
| **humanizer** | [blader/humanizer](https://github.com/blader/humanizer) | Retire les marqueurs de texte IA (29 patterns Wikipedia) |
| **planning-with-files** | [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | Planification Manus-style avec fichiers persistants (`task_plan.md` / `findings.md` / `progress.md`) |
| **phone-input** | [ZeframLou/call-me](https://github.com/ZeframLou/call-me) | Appels téléphoniques (via MCP + Telnyx/Twilio) |
| **claude-hud** | [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) | Statusline temps réel (contexte, tools, todos, git) |

## Layout

```
~/.claude/
├── settings.json                 # config principale (hooks + statusline + permissions)
├── skills/
│   ├── caveman/                  # skill + intensités lite/full/ultra/wenyan
│   ├── caveman-commit/           # /caveman-commit — messages Conventional Commits
│   ├── caveman-review/           # /caveman-review — revue de code une ligne
│   ├── caveman-help/             # /caveman-help — cheat-sheet
│   ├── caveman-compress/         # /caveman-compress FILEPATH — compresse fichiers CLAUDE.md
│   ├── humanizer/                # /humanizer — dé-IA du texte
│   ├── planning-with-files/      # planification Manus + templates + scripts
│   └── phone-input/              # skill call-me
├── hooks/
│   ├── caveman-activate.js       # SessionStart — active caveman
│   ├── caveman-mode-tracker.js   # UserPromptSubmit — bascule lite/full/ultra
│   ├── caveman-config.js
│   └── caveman-statusline.sh
└── plugins/
    ├── claude-hud/               # statusline (dist/ précompilé)
    └── call-me/                  # serveur MCP (Bun) + hooks
```

## Installation

```bash
bash scripts/install-skills.sh
```

Le script clone les 5 dépôts, copie les fichiers vers `~/.claude/`, rend les
scripts exécutables et écrit `~/.claude/settings.json`.

Prérequis : `git`, `node ≥ 18` (déjà installé dans cet environnement).

## Configuration active

`~/.claude/settings.json` définit :

- **statusLine** → `node ~/.claude/plugins/claude-hud/dist/index.js`
- **SessionStart hook** → `caveman-activate.js` (active caveman mode `full` par défaut)
- **UserPromptSubmit hook** → `caveman-mode-tracker.js` (détecte `/caveman lite|full|ultra`)
- **env.CAVEMAN_DEFAULT_MODE** = `full` — bascule vers `off`, `lite`, `ultra`, `wenyan`, etc.
- **permissions.allow** — auto-approuve les 9 skills

## call-me : credentials à fournir

Le skill `phone-input` nécessite un provider téléphonique et des clés API.
Renseignez ces variables dans `~/.claude/settings.json` sous `env` :

| Variable | Description |
|----------|-------------|
| `CALLME_PHONE_PROVIDER` | `telnyx` (recommandé, ~50 % moins cher) ou `twilio` |
| `CALLME_PHONE_ACCOUNT_SID` | Telnyx Application ID / Twilio Account SID |
| `CALLME_PHONE_AUTH_TOKEN` | Telnyx API Key / Twilio Auth Token |
| `CALLME_PHONE_NUMBER` | Numéro d'où Claude appelle (E.164) |
| `CALLME_USER_PHONE_NUMBER` | Votre numéro (E.164) |
| `CALLME_OPENAI_API_KEY` | Clé OpenAI pour STT (et TTS si Kokoro absent) |
| `CALLME_NGROK_AUTHTOKEN` | Token ngrok (webhook tunneling) |

Puis démarrer le serveur MCP :

```bash
cd ~/.claude/plugins/call-me/server && bun install && bun run start
```

## Usage rapide

| Commande | Effet |
|----------|-------|
| `/caveman` / `/caveman lite\|ultra\|wenyan` | Change intensité de compression |
| `/caveman-commit` | Génère un message de commit terse |
| `/caveman-review` | Revue de code une ligne par commentaire |
| `/caveman-compress CLAUDE.md` | Compresse un fichier mémoire (backup `.original.md`) |
| `/humanizer` + texte | Dé-IA d'un passage |
| Toute tâche multi-étapes | `planning-with-files` s'auto-active (crée `task_plan.md`) |
| `/plugin claude-hud:configure` | Personnalise le HUD (couleurs, layout, presets) |

Pour désactiver caveman : `"CAVEMAN_DEFAULT_MODE": "off"` dans settings.json,
ou dire "stop caveman" / "normal mode" au milieu d'une session.
