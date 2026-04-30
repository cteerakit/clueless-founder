---
title: "Vibe Coding as a No-Coder: My Honest Experiment"
description: "I tested vibe coding as a non-technical founder and learned where AI helps fast, where it breaks, and what core product and data skills no-coders still need."
excerpt: "I tested vibe coding as a non-technical founder and learned where AI helps fast, where it breaks, and what core product and data skills no-coders still need."
coverImage: "/images/posts/vibe-coding-as-a-no-coder/cover-7450ee95b9.webp"
pubDate: 2025-06-12
category: "Product"
tags: ["vibe-coding", "ai-coding", "no-code", "experimentation"]
newsletter: true
draft: false
---

For the past few weeks, I have dived deep into something called **vibe coding**. As a no-coder, my curiosity was through the roof. Could I truly leverage AI to build products without writing a single line of code? What did this even mean for someone like me?

Today, I am pulling back the curtain to share what I found: the good, the bad, and the truly eye-opening lessons.

## What's "Vibe Coding" Anyway?

I define vibe coding as creating software by letting AI do the heavy lifting, without writing the code yourself. This concept is not entirely new, but with AI getting smarter by the day, it is becoming incredibly powerful. People are literally building entire products just by explaining what they want to an AI in plain English.

Since I can only code in basic HTML and CSS, this was a massive draw. My goal was simple: see if I, with zero coding background, could actually build a functional product using AI.

## My Tool of Choice: Lovable

![](/images/posts/vibe-coding-as-a-no-coder/inline-01-d33beb5e18.webp)

The market is buzzing with "vibe coding" tools right now. As a no-coder, I needed something genuinely accessible. I chose **Lovable**. It promised a low technical barrier, perfect for someone who just wants to build without getting tangled in code.

To put Lovable to the test, I brainstormed a few product ideas, mostly tools I wished existed. Then I simply prompted Lovable to bring them to life.

## Project: Day Planner

My first attempt involved a simple day planning tool. While I am a Todoist user, I wondered if I could create something straightforward for others. Many task managers are too complex, do not support Thai language, and most people simply need an easy way to manage tasks, share them, and keep track of their plate.

I started with a super simple prompt: "Create a task management tool." Lovable responded quickly, generating a UI, a Kanban board, and task adding functionality. Sounds great, right? Not quite.

![](/images/posts/vibe-coding-as-a-no-coder/inline-02-4f0ac40100.webp)

The first major hurdle hit immediately: **data persistence**. My tasks vanished every time I refreshed the page, meaning data was not being saved. Thankfully, Lovable integrates smoothly with **Supabase**, a PostgreSQL database. Linking my project to Supabase solved this. Now, tasks saved to the app were stored in the database and reappeared on refresh.

I continued adding features: projects, icons, colors; the app was really taking shape. But then, Lovable started misbehaving. Sometimes, my prompts to change something would yield no change at all.

This taught me my first big lesson: **words matter**. I wanted a "dropdown menu" to appear when clicking a three-dot icon, for renaming or deleting projects. However, I kept calling it a "context menu." Lovable did create a context menu, which appeared when I right-clicked the icon! If I had used "dropdown menu" from the start, it would have worked instantly. Even with plain English, you still need to speak the programmer's language, to get what you want.

Then came team functionality. Allowing team members to see each other's tasks meant I needed to design an "organization" structure within the database. Should tasks live with the user or the organization? This led to another crucial insight: for complex apps, you must **plan your data structure and how things relate in the database**. Without this blueprint, the AI will build something that simply does not work the way you envision.

Plus, the AI sometimes had a mind of its own, deleting existing features when I asked for new ones. You need to be incredibly specific with prompts, or ideally, set rules for what the AI should not touch.

Finally, **external integrations**, like Google authentication, proved almost impossible. Despite asking the AI to fix errors, I could not get it working. My lack of understanding about how Google authentication works and how apps interact with it left me completely stuck.

After this failed project, I tried a few more times. Each time, I ran into new problems. Sometimes I just didn't understand how the data should move. Other times, I needed a specific connection that was hard to set up. Or the AI would do something unexpected. I kept getting stuck because I didn't have a strong technical background. It became clear that even though the AI could write the code, my inability to fix issues or design complex systems meant I often had no idea how to move forward.

## The Bottom Line: Vibe Coding for No-Coders

So, what is my takeaway?

- **Internal Tools?** Yes! Vibe coding is fantastic for building simple, internal tools for yourself or a small team. You can get something functional up and running incredibly fast for very specific tasks.
- **Production Apps?** Not So Much. If you are dreaming of a complex, production-ready application for the masses, you will struggle without some fundamental coding knowledge.
- **A Programmer's Superpower:** For developers who already understand app design, logic, best practices, and security, vibe coding will be a game-changer, letting them build at warp speed.

What no-coders still need to learn: For us "clueless founders" who do not code, there is still a learning curve. To truly harness AI's power, we need to grasp:

- Basic application architecture.
- Database design and relationships.
- UI/UX principles.
- The correct terminology that programmers use.

In short, vibe coding is powerful, but it is not a magic wand that bypasses the need for any technical understanding. You might not write the code, but you still need to learn the language of building.
