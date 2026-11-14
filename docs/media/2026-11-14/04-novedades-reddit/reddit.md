# Reddit: novedades-reddit

The subreddit, the day its rules were read and what they say about self-promotion are in `sheet.md`. The title is
300 characters at most. Give something to the community before promoting.

## en

**Title:** Workshop log: two weeks, five projects and a website that loads 62% less JavaScript

Image: media/1-changelog.webp

Galivelop is our workshop: we build, research and learn in the open, and our public projects are open to collaborators. Here's what actually changed in each one over the last two weeks.

**Tarkor**, a narrative RPG where the world moves on even when you stop
- It has its own map generator now, which builds each region in layers, so you can travel between regions counting the hours and days on the road.
- 25 zones of the world brought in line with the story's canon.
- Play-testing fixes: the Town Hall can be repaired after a rebellion, companions show up in the combat panel, and each combat round is narrated better.
- The installer lets you choose which game data to delete when uninstalling.

**Galivelop-workflow 0.6.0**, the way we work with AI coding agents, packaged for any project
- It records tokens per session and model, so you can see where the spend goes.
- It recommends a model and an effort level for each task.
- Long branches get reviewed in blocks instead of one huge review at the end.
- The repo is public: https://github.com/Zeldris/Galivelop-workflow

**Galivelop Image Generator 0.5.0**, a local image generator (MIT)
- Export to WebP, ICO and BMP, with crop.
- The queue can be paused and resumed.
- Negative prompts from the command line, the API and the interface.
- The interface was redesigned and adapts to narrow screens.

**toVeriAI**, a score that explains how far you can trust a news story
- Behind-the-scenes work: the server copes better with limited resources, and the tools were updated with security fixes.

**Galivelop Voice Generator** (coming soon)
- Voices with local AI. 2 of 8 phases done; next up is the real voice engine.

**The website**
- A new News page brings every project's updates together, with a filter per project.
- Pages now load per route: the initial JavaScript dropped from 258 KB to 97 KB gzipped.
- Sharing a page in Galician or English now shows a link preview in that language.
- An accessibility audit raised one accent's contrast from 3.2:1 to 5:1.
- The icons and illustrations on the site come from our own image generator, running locally.

Everything in one place: https://zeldris.github.io/Portal-Galivelop/novedades/

Which of these would you like a deeper write-up on? Feedback, questions and pull requests are welcome, especially on the workflow and the image generator.
