#!/usr/bin/env bash
# Installe 5 skills GitHub pour Claude Code + configure settings.json.
# Idempotent : réécrit tout depuis les dépôts upstream.
set -euo pipefail

CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
SKILLS_DIR="$CLAUDE_DIR/skills"
HOOKS_DIR="$CLAUDE_DIR/hooks"
PLUGINS_DIR="$CLAUDE_DIR/plugins"
WORK_DIR="$(mktemp -d)"

mkdir -p "$SKILLS_DIR" "$HOOKS_DIR" "$PLUGINS_DIR"

clone() {
    local repo="$1" dest="$2"
    if [ -d "$dest" ]; then rm -rf "$dest"; fi
    git clone --depth 1 "$repo" "$dest" >/dev/null 2>&1
}

echo "→ Clonage des 5 dépôts…"
clone https://github.com/JuliusBrussee/caveman.git             "$WORK_DIR/caveman"
clone https://github.com/blader/humanizer.git                  "$WORK_DIR/humanizer"
clone https://github.com/OthmanAdi/planning-with-files.git     "$WORK_DIR/planning-with-files"
clone https://github.com/ZeframLou/call-me.git                 "$WORK_DIR/call-me"
clone https://github.com/jarrodwatts/claude-hud.git            "$WORK_DIR/claude-hud"

install_dir() {
    local src="$1" dst="$2"
    rm -rf "$dst"
    cp -r "$src" "$dst"
}

echo "→ humanizer"
mkdir -p "$SKILLS_DIR/humanizer"
cp "$WORK_DIR/humanizer/SKILL.md" "$SKILLS_DIR/humanizer/"

echo "→ caveman (5 skills + hooks)"
for s in caveman caveman-commit caveman-review caveman-help caveman-compress; do
    install_dir "$WORK_DIR/caveman/skills/$s" "$SKILLS_DIR/$s"
done
for f in caveman-activate.js caveman-config.js caveman-mode-tracker.js \
         caveman-statusline.sh package.json; do
    cp "$WORK_DIR/caveman/src/hooks/$f" "$HOOKS_DIR/"
done
chmod +x "$HOOKS_DIR"/*.js "$HOOKS_DIR"/*.sh

echo "→ planning-with-files"
install_dir "$WORK_DIR/planning-with-files/skills/planning-with-files" \
            "$SKILLS_DIR/planning-with-files"
cp -r "$WORK_DIR/planning-with-files/templates" "$SKILLS_DIR/planning-with-files/templates"
cp -r "$WORK_DIR/planning-with-files/scripts"   "$SKILLS_DIR/planning-with-files/scripts"
chmod +x "$SKILLS_DIR/planning-with-files/scripts/"*.sh \
         "$SKILLS_DIR/planning-with-files/scripts/"*.py 2>/dev/null || true

echo "→ call-me (skill + MCP server)"
install_dir "$WORK_DIR/call-me/skills/phone-input" "$SKILLS_DIR/phone-input"
mkdir -p "$PLUGINS_DIR/call-me"
cp -r "$WORK_DIR/call-me/server" "$PLUGINS_DIR/call-me/server"
cp -r "$WORK_DIR/call-me/hooks"  "$PLUGINS_DIR/call-me/hooks"
cp    "$WORK_DIR/call-me/README.md" "$PLUGINS_DIR/call-me/"

echo "→ claude-hud (statusline)"
mkdir -p "$PLUGINS_DIR/claude-hud"
cp -r "$WORK_DIR/claude-hud/dist"     "$PLUGINS_DIR/claude-hud/dist"
cp -r "$WORK_DIR/claude-hud/commands" "$PLUGINS_DIR/claude-hud/commands"
cp    "$WORK_DIR/claude-hud/package.json" "$PLUGINS_DIR/claude-hud/"
cp    "$WORK_DIR/claude-hud/README.md"    "$PLUGINS_DIR/claude-hud/"

echo "→ settings.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cp "$SCRIPT_DIR/config/settings.json" "$CLAUDE_DIR/settings.json"

rm -rf "$WORK_DIR"

echo
echo "Installation terminée."
echo "  Skills :  $(ls "$SKILLS_DIR" | tr '\n' ' ')"
echo "  Statusline claude-hud active."
echo "  Caveman mode 'full' actif à chaque session (SessionStart hook)."
echo
echo "→ Pour activer call-me : renseigner les variables CALLME_* dans"
echo "  $CLAUDE_DIR/settings.json puis démarrer :"
echo "  cd $PLUGINS_DIR/call-me/server && bun install && bun run start"
