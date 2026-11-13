from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components


ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"

st.set_page_config(
    page_title="FoodVerse AI",
    page_icon="🍃",
    layout="wide",
    initial_sidebar_state="collapsed",
)


def load_react_app() -> str:
    """Return the compiled React application as one embeddable HTML document."""
    index_path = DIST / "index.html"
    if not index_path.exists():
        raise FileNotFoundError(
            "The compiled frontend is missing. Run `pnpm run build` and commit the dist folder."
        )

    index_html = index_path.read_text(encoding="utf-8")
    css_files = sorted((DIST / "assets").glob("*.css"))
    js_files = sorted((DIST / "assets").glob("*.js"))
    if not css_files or not js_files:
        raise FileNotFoundError("The compiled CSS or JavaScript bundle is missing from dist/assets.")

    css = "\n".join(path.read_text(encoding="utf-8") for path in css_files)
    javascript = "\n".join(path.read_text(encoding="utf-8") for path in js_files)
    javascript = javascript.replace("</script", "<\\/script")

    body_start = index_html.find("<body>")
    body_end = index_html.find("</body>")
    body = index_html[body_start + len("<body>") : body_end]

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f6f7f2" />
    <title>FoodVerse AI</title>
    <style>{css}</style>
  </head>
  <body>
    {body}
    <script type="module">{javascript}</script>
  </body>
</html>"""


st.markdown(
    """
    <style>
      #MainMenu, header, footer { visibility: hidden; }
      .stApp { background: #f6f7f2; }
      .block-container { padding: 0; max-width: 100%; }
      iframe[title="streamlit.components.v1.html"] { border: 0; }
    </style>
    """,
    unsafe_allow_html=True,
)

try:
    components.html(load_react_app(), height=1100, scrolling=True)
except FileNotFoundError as error:
    st.error(str(error))
    st.code("pnpm install\npnpm run build", language="bash")
