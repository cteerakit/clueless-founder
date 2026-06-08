---
title: "Beyond chatbots: my ultimate hands-on guide to AI agents (and how to choose the right one)"
description: "A hands-on comparison of AI agents from Gemini, Claude Co-work, Codex, Manus, and more — plus the productivity stack I actually run today."
excerpt: "A hands-on comparison of AI agents from Gemini, Claude Co-work, Codex, Manus, and more — plus the productivity stack I actually run today."
coverImage: "/images/posts/beyond-chatbots-ai-agents-guide/cover-502b0e98b2.webp"
pubDate: 2026-06-08
category: "Productivity"
tags: ["ai-agents", "ai-tools", "productivity", "automation", "cursor", "gemini"]
newsletter: true
draft: false
---

Lately, I've been playing around with a ton of different AI tools and platforms. The reason I started down this rabbit hole is that AI tools are becoming incredibly advanced. They are starting to do a lot of things automatically by themselves, and I wanted to see if they could actually take over some of my work and automate my regular, day-to-day tasks.

Before this, I stuck to general-purpose AI tools—the classic chatbots and assistants like Gemini, ChatGPT, and Claude. They are great for asking questions and finding information, but they always have to circle back to you. It's a bit basic.

Now, I'm talking about **AI agents**. With an agent, the AI actually *does* the work while you just sit back, relax, and check in on what it completed. There are quite a few options hitting the market right now. Gemini recently launched Gemini Spark, ChatGPT has Codex, Claude offers Co-work, and we have others like Perplexity Computer and Manus. I've tried them all, and I want to share my honest thoughts on each one so you know exactly how to pick the right tool for your needs.

## The real cost of letting AI do your job

Most people diving into AI agents are going to be concerned about the cost. When I started running some of these agents and looked at how many tokens they consume versus what you actually have to pay, it was eye-opening.

If you have a complex task that needs to trigger every single day and takes a few hours to complete, running it on the cloud can get super expensive. In fact, for some complex tasks, **you might actually be better off hiring a human freelancer** to do the job. However, for basic, everyday tasks that aren't too complicated, AI agents are incredibly efficient.

Before we look at the pure agents, let's talk about my foundation: the classic AI assistant chatbots.

## Why I chose the Gemini ecosystem for day-to-day chat

When it comes to standard chatbots, the big three are Gemini, ChatGPT, and Claude. I've tried them all, and I ended up subscribing to the Google AI Plus plan to use Gemini.

Don't get me wrong—all three platforms are incredibly powerful. Frankly, ChatGPT and Claude are actually *more* powerful than Gemini as pure assistants and usually do a better job. But if you look at the cost, they all start at around $20 a month.

The tie-breaker for me was the value bundle. Gemini's plan gives you extra perks like Google Drive storage and YouTube Premium. Since I already live in the Google ecosystem and use Google Drive anyway, it didn't make sense to pay for Google storage *and* subscribe to a completely separate chatbot platform. If you aren't tied to Google, you're totally free to choose whichever fits your lifestyle.

Here is how the big brand ecosystems handle agent-like tasks:

### 1. The Google ecosystem

If you are on a free plan or a basic starting plan, you don't get access to real AI agents at all. You can connect Gemini to Gmail and Google Drive to do basic things, but it can't act autonomously.

However, the built-in tools are getting amazing. For example, you can open Google Sheets, tell Gemini what to do, and it will edit your sheets, create data, and analyze everything right there. It feels almost like an agent, but it's not truly autonomous yet—you still have to guide it step-by-step rather than letting it run a massive multi-step workflow.

Google also has another option called **Antigravity**. This is Google's version of a computer-controlling agent, and it works very similarly to Codex and Claude Co-work. It runs tasks directly on your machine, meaning you have to keep your computer turned on while it works.

The main catch is that you won't get access to Antigravity on Google's cheaper plans. You have to pay for one of their higher-tier Gemini plans to unlock it. The good news is that the usage cost is pretty reasonable. It is about as cheap to run as Codex and won't break the bank like Claude Co-work.

### 2. Claude Co-work and Claude Code

Unlike Google's current setup, Claude Co-work can handle complex, multi-step agent tasks. You can give it a single goal, and it will run multiple tools to accomplish it. It can search the web, dump that data into Excel, analyze the file, and then bring the results back to you.

The downside? The cost is tough to justify. If you use Claude's $20-a-month starting plan, you can't do serious, heavy work. Claude's Opus model is one of the most expensive models out there, and **you can burn through your token limits in a single day**.

### 3. ChatGPT Codex

OpenAI's Codex functions very similarly to Claude Co-work, letting you execute tasks directly on your computer by writing and running code.

Between the two, Codex is much more forgiving on your wallet. You can start with the $20 Plus plan and stretch your usage much further than you can with Claude. Plus, in my opinion, the Codex user interface is much cleaner, looks nicer, and just makes a lot more sense visually.

## The biggest flaw with standard AI agents

While Codex and Claude Co-work are great, I ran into a massive roadblock: **I have to leave my computer turned on for these agents to work**.

The clue is in the name—it's called Claude *Co-work*, not Claude *Does-all-your-work-while-you-sleep*. It's designed to collaborate with you, meaning you need to sit there, grant permissions, and offer guidance. It isn't 100% autonomous.

On one hand, that's great for control—you see everything it does on your screen, and when you shut your computer down, it stops. But what if you need reliability? If I want a task to run at precisely 9:00 AM every single day whether my laptop is open or closed, local agents pose a problem. If your internet hiccups or your electricity goes down, your automated agent goes down with it.

This realization drove me to look for alternative setups, which led me to two different categories: **Self-Hosted Local Agents** and **Cloud Agents**.

## Going rogue: self-hosted agents (Open Claw vs. Hermes)

If you want the flexibility of Codex or Claude Co-work but don't want to be locked into a single brand's expensive ecosystem, you can look into self-hosted AI agents like **Open Claw** and **Hermes**.

With these tools, you aren't tied to just OpenAI or Claude models—you can use any AI model you want. You can host them on your main computer, a spare machine, or even in the cloud.

Here is how my experience went with both:

* **Open Claw:** This tool is incredibly powerful, but honestly, it's a bit of a mess. It breaks a lot while you're working, and you constantly have to ask it to fix itself. You need to be highly technical and comfortable with Linux, scripts, and terminal commands to keep it stable. For general users, it's just too much of a headache.

* **Hermes:** Hermes was much easier to set up and far more reliable for me. I actually ended up installing Hermes on a **Raspberry Pi 5**—a tiny, low-power computer that I can comfortably leave turned on 24/7 without crying over my electricity bill.

Because the Raspberry Pi isn't a powerhouse, Hermes handles basic text-based tasks for me. I have it connected to my Todoist, Gmail, calendar, and logs to pull information and organize my life. It *does* hiccup if I ask it to open a heavy browser and navigate the live internet, but it excels at the basics.

The best part about Hermes is the cost efficiency. Because it can run any model, I can assign cheap models to easy tasks and pull out the expensive models only when a task gets complex. It ends up being way cheaper than standard brand subscriptions.

## Fully autonomous cloud agents: Manus and Perplexity Computer

If you truly want an agent that lives entirely in the cloud so you can trigger it from your phone and walk away, you have options like **Manus** and **Perplexity Computer**.

The concept here is beautiful: you ask the AI to do something, and it spins up a completely independent virtual machine in the cloud to execute the task 24/7.

The problem? **They are wildly, restrictively expensive**.

Manus uses a credit system where every single action eats away at your paid balance. When I tested Manus for my actual daily work, it literally cost me more than it would have cost to hire a real human being to do it.

Perplexity Computer is a similar concept—pivoting Perplexity from a search engine into an AI orchestrator that uses multiple models to spin up virtual environments. But out of every single option I tried, **Perplexity Computer was the absolute most expensive**. If Manus can't even compete with human wages, Perplexity Computer is an immediate no-go for regular automation.

## My secret workaround: using developer IDEs as agents

This brings me to a bit of a technical workaround I stumbled into. If you aren't interested in the technical weeds, feel free to skip to my final summary, but this completely changed my setup.

At their core, tools like Codex, Claude Code, and Claude Co-work are just writing code and executing it to control your machine. Knowing that, I started looking at specialized developer tools called IDEs (Integrated Development Environments)—specifically AI-powered ones like **Cursor** and **Windsurf**.

I already had an active subscription to Cursor for coding projects and software extensions. On a whim, I tried using it to solve my automation problems, and it was surprisingly incredible at agentic work.

While developers normally use Cursor to debug apps, I used it to write code that controls a cloud browser to do my daily tasks. It spins up its own virtual environment in the cloud, meaning I get the hands-off freedom of Manus without keeping my own laptop running.

What makes Cursor the ultimate cheat code right now is its new model: **Composer 2.5**. It is incredibly smart—very close to the intelligence level of Claude's massive Opus model—but it is **10 times cheaper**. By routing my local and cloud agent tasks through Cursor using Composer 2.5, I effectively get 10x the automated productivity for a fraction of the market cost. Sure, it's a workaround, and because it's designed for coding it occasionally does something a little weird, but it does a fantastic job most of the time.

## My current AI productivity stack

I honestly didn't expect to end up with this specific setup. Going in, I thought I'd just settle on Claude Co-work or ChatGPT Codex because they get so much hype online. But after crunching the numbers, those mainstream platforms just aren't cost-efficient enough to justify over human help for massive, token-heavy tasks.

Instead, here is the exact stack I run today:

| Tool | Role | Platform/Hardware |
| --- | --- | --- |
| **Gemini (Google AI Plus)** | Day-to-day personal assistant, emails, and spreadsheet analysis | Cloud / Google Ecosystem |
| **Hermes** | Handling basic, secure text-based automation and data pulling | Local Raspberry Pi 5 (Running 24/7) |
| **Cursor (Composer 2.5)** | Heavy-duty automation running via cloud-based browsers | Cloud Agent Workaround |

AI agents might not completely replace human freelancers for hyper-complex, hours-long tasks anytime soon due to soaring token costs, but for mastering information and daily workflows? They can outgrow human speed easily.

What about you? Have you started experimenting with autonomous agents yet, or are you still sticking to standard chatbots? Let me know what your stack looks like!
