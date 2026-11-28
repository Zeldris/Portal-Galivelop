# Reddit: novedades-reddit

The subreddit, the day its rules were read and what they say about self-promotion are in `sheet.md`. The title is
300 characters at most. Give something to the community before promoting.

## en

**Title:** Workshop log: tools that know when to stop, four new projects, and two local-AI products on the way

Image: media/card-en.webp

Galivelop is our workshop: we build, research and learn in the open, and our public projects are open to collaborators. Two weeks ago I shared a log here. This is what's changed since then, and what's coming next.

**The thread running through it: knowing when to stop**

Have you ever used a tool that fails, retries, fails again and never tells you why? Fixing that was the theme of the last two weeks.

**Galivelop IG**, our image generator (MIT)
- It makes images on your own machine. Nothing leaves your computer.
- If it fails three times in a row, it stops and asks you to fill in what happened before it goes on.
- It now groups requests into batches.
- Page: https://zeldris.github.io/Portal-Galivelop/proyectos/galivelop-image-generator
- Code: https://github.com/Zeldris/galivelop-image-generator

**Galivelop-workflow 0.9**, the way we work with AI coding agents, packaged for any project
- The agent asks you questions before it starts (since 0.8).
- It stops if the session's model or effort level isn't what the task calls for, instead of working through it anyway.
- 0.9 adds configurable languages and spreads each review across several reviewers.
- It also installs for opencode and Codex.
- Page: https://zeldris.github.io/Portal-Galivelop/proyectos/galivelop-workflow
- Code: https://github.com/Zeldris/Galivelop-workflow

**Tarkor**, a text RPG with a local AI as game master
- We're still in a play-testing round, playing it ourselves and checking every fix.
- Characters now answer without giving their secrets away.
- Combat understands better when you're dodging.
- Page: https://zeldris.github.io/Portal-Galivelop/proyectos/tarkor
- Code: https://github.com/Zeldris/World-Maker-Fantasy (installer: https://github.com/Zeldris/Instalador-WMF-Tarkor)

**toVeriAI**, which tells you how far you can trust a news story, and why
- The website is now comfortable to use on a phone.
- https://www.toveriai.com

**Four new projects coming soon**

Alongside Galivelop Voice Generator (voices with local AI), four more join the list:
- **Forge**: a data and fine-tuning factory for the workshop's local models.
- **Runtime**: the shared core of our local generators, meaning the queue, the turns and a shared machine lock, so the image and voice tools don't fight over the same hardware.
- **Worlds**: a kit for making living fictional worlds with local AI.
- **Model Atlas**: which model fits on which machine.

**Two products from Álvaro (founder)**

Some of what comes out of the workshop becomes a product. There are two, both in development:

**Galivelop Developer (GalivelopCode)**: your workflow, with AI on your machine
- It connects Galivelop-workflow to AI agents that run on your own computer. They do the project's work and you decide what goes in.
- Three roles (one organises, one does the work, one reviews), each covered by the local model that measures best on your hardware.
- The agent works in a separate working copy, the checks run, the change gets reviewed, and only then does it go into your project.
- What the agent must not touch is blocked by the system, not by politely asking the model.
- No mandatory cloud and no per-use bill. The cloud is optional, per role, if you want it.
- Planned requirements, tested on a Steam Deck: 64-bit Linux or SteamOS, about 9 GB free memory for the model (5 GB with the fallback model), integrated graphics with Vulkan are fine, no admin rights, and no account to work locally.
- https://zeldris.github.io/Portal-Galivelop/productos/galivelop-developer

**Galivelop Evaluator (GVE)**: measure first, improve with proof
- You change a prompt, a model or the way your system searches, and it seems better. GVE checks: it measures before and after with the same questions and tells you plainly what improved and what got worse.
- Every test records its configuration, so anyone can run it again and get the same result.
- A missing result is never counted as a pass.
- Part of the questions are held out. They're never used to design the improvement, only to confirm it.
- It starts with AI systems that work on text, beginning with information retrieval, with the same questions in Spanish and English. It's a terminal command (`gve`) that needs Python 3.10+ and git, with no external dependencies.
- https://zeldris.github.io/Portal-Galivelop/productos/galivelop-evaluator

Both are private. There are no prices and no forms: if your case fits, write to Álvaro and talk it through.

**The why behind it**

The workshop journal has five new entries, from why we use a game console (a Steam Deck) as our reference machine to a short story set in Tarkor's world: https://zeldris.github.io/Portal-Galivelop/diario

Now a question for you: when one of your tools fails, would you rather it keep retrying or stop and ask you? Feedback, questions and pull requests are welcome, especially on the workflow and the image generator.
