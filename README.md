# 台灣手搖杯管家 (Taiwan Hand-Shaken Drink AI Skill)

The ultimate Taiwanese hand-shaken drinks skill for LLMs. This project provides prompts, structured knowledge, and a massively generated database covering **300 Multi-Store Chains**, featuring exactly **13,500 programmatically generated items**.

> **🌟 Google Batch Verified Accuracy (V 15.0.0):** The algorithmic pricing and calorie logic was subjected to rigorous cluster-sampling via Google Search in Phases 9, 11, 12, 13, 14, and the final Phase 15 Omniverse validation which verified multi-store regional powerhouses (e.g. 思茶, 圈圈微森, 軒苑) via local maps and reviews.

## 📁 Repo Structure
```
shake/
├── SKILL.md                 # agentskills.io skill (Hermes/Claude)
├── README.md                # This file
├── SOURCES.md               # All data sources with URLs
│
├── website/                 # Web Interface UI
│   ├── index.html           # Main frontend app
│   ├── style.css            # Styling and animations
│   └── script.js            # JSON parser logic
│
├── prompts/                 # Platform-specific prompts
├── references/              # Deep knowledge
│
├── scripts/
│   └── generate_all_drinks.py # 13,500-Item combination generator
│
└── data/                    # Structured data
    └── drink-database.json  # Massive Hand-shaken drink database
```

## 🤖 What It Does
1. **Absolute Recommendations** — Matches users to drinks based on brand, category, budget, and calorie limits across **300 brands and 13,500 items**. 
2. **Advanced Calorie Calculator** — Helps users understand the calorie impact of "Normal Sugar vs. No Sugar" and topping traps exactly mapped to 300 distinctive brand quirks.

## 📖 How to Install
### Via Website
Run a local Python server in the root of this project:
```bash
python3 -m http.server 8000
```
And navigate to `http://localhost:8000/website/index.html`.
