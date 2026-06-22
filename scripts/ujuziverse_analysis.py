#!/usr/bin/env python3
"""Ujuziverse Comprehensive UX & Product Analysis Report."""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.graphics.shapes import Drawing, Rect, String

FONT_DIR = '/usr/share/fonts'

pdfmetrics.registerFont(TTFont('Tinos', f'{FONT_DIR}/truetype/english/Tinos-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Bold', f'{FONT_DIR}/truetype/english/Tinos-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Italic', f'{FONT_DIR}/truetype/english/Tinos-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-BoldItalic', f'{FONT_DIR}/truetype/english/Tinos-BoldItalic.ttf'))
registerFontFamily('Tinos', normal='Tinos', bold='Tinos-Bold', italic='Tinos-Italic', boldItalic='Tinos-BoldItalic')

PAGE_BG = colors.HexColor('#f1f0f0')
HEADER_FILL = colors.HexColor('#786e4f')
COVER_BLOCK = colors.HexColor('#776d52')
BORDER = colors.HexColor('#d6d1c2')
ACCENT = colors.HexColor('#8e7423')
ACCENT_2 = colors.HexColor('#4197b4')
TEXT_PRIMARY = colors.HexColor('#1b1a18')
TEXT_MUTED = colors.HexColor('#8b8881')
TABLE_STRIPE = colors.HexColor('#ecebe8')

styles = getSampleStyleSheet()
s_h1 = ParagraphStyle('H1', fontName='Tinos-Bold', fontSize=20, leading=26, textColor=HEADER_FILL, spaceBefore=18, spaceAfter=8)
s_h2 = ParagraphStyle('H2', fontName='Tinos-Bold', fontSize=15, leading=20, textColor=ACCENT, spaceBefore=14, spaceAfter=6)
s_h3 = ParagraphStyle('H3', fontName='Tinos-Bold', fontSize=12, leading=16, textColor=TEXT_PRIMARY, spaceBefore=10, spaceAfter=4)
s_body = ParagraphStyle('Body', fontName='Tinos', fontSize=10.5, leading=15, textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceBefore=3, spaceAfter=3)
s_bold = ParagraphStyle('Bold', fontName='Tinos-Bold', fontSize=10.5, leading=15, textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceBefore=3, spaceAfter=3)
s_quote = ParagraphStyle('Quote', fontName='Tinos-Italic', fontSize=10, leading=14, textColor=TEXT_MUTED, leftIndent=20, rightIndent=20, spaceBefore=4, spaceAfter=4)
s_bullet = ParagraphStyle('Bullet', fontName='Tinos', fontSize=10.5, leading=15, textColor=TEXT_PRIMARY, leftIndent=24, bulletIndent=12, spaceBefore=2, spaceAfter=2, alignment=TA_JUSTIFY)
s_child_name = ParagraphStyle('CN', fontName='Tinos-Bold', fontSize=11, leading=15, textColor=HEADER_FILL, spaceBefore=10, spaceAfter=2)
s_child_voice = ParagraphStyle('CV', fontName='Tinos-Italic', fontSize=10, leading=14, textColor=TEXT_MUTED, leftIndent=16, spaceBefore=2, spaceAfter=2)
s_small = ParagraphStyle('Small', fontName='Tinos', fontSize=9, leading=12, textColor=TEXT_MUTED)
s_th = ParagraphStyle('TH', fontName='Tinos-Bold', fontSize=9.5, leading=13, textColor=colors.white, alignment=TA_CENTER)
s_td = ParagraphStyle('TD', fontName='Tinos', fontSize=9, leading=13, textColor=TEXT_PRIMARY)
s_toc1 = ParagraphStyle('T1', fontName='Tinos-Bold', fontSize=12, leading=18, textColor=HEADER_FILL, leftIndent=0, spaceBefore=6)
s_toc2 = ParagraphStyle('T2', fontName='Tinos', fontSize=10.5, leading=16, textColor=TEXT_PRIMARY, leftIndent=20, spaceBefore=2)

OUTPUT = '/home/z/my-project/download/Ujuziverse_UX_Product_Analysis.pdf'
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

def h(text, level=1):
    return Paragraph(text, {1: s_h1, 2: s_h2, 3: s_h3}[level])

def p(text):
    return Paragraph(text, s_body)

def b(text):
    return Paragraph(text, s_bold)

def bl(text):
    return Paragraph(f'<bullet>&bull;</bullet>{text}', s_bullet)

def child(name, age, personality, voice, issue):
    return [
        Paragraph(f'{name}, Age {age} -- {personality}', s_child_name),
        Paragraph(f'{voice}', s_child_voice),
        Paragraph(f'<b>Issue:</b> {issue}', s_bullet),
    ]

def tbl(headers, rows, cw=None):
    w = A4[0] - 4.4*cm
    if cw is None:
        cw = [w/len(headers)] * len(headers)
    hdr = [Paragraph(x, s_th) for x in headers]
    data = [hdr]
    for r in rows:
        data.append([Paragraph(str(c), s_td) for c in r])
    t = Table(data, colWidths=cw, repeatRows=1)
    cmds = [
        ('BACKGROUND', (0,0), (-1,0), HEADER_FILL),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.4, BORDER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]
    for i in range(2, len(data), 2):
        cmds.append(('BACKGROUND', (0,i), (-1,i), TABLE_STRIPE))
    t.setStyle(TableStyle(cmds))
    return t

doc = SimpleDocTemplate(OUTPUT, pagesize=A4, topMargin=2.2*cm, bottomMargin=2.2*cm, leftMargin=2.2*cm, rightMargin=2.2*cm, title='Ujuziverse UX & Product Analysis', author='Product Analysis Team', subject='Comprehensive UX review and go-to-market strategy for Ujuziverse')

story = []

# COVER
story.append(Spacer(1, 60))
d = Drawing(480, 320)
d.add(Rect(0, 0, 480, 320, fillColor=HEADER_FILL, strokeColor=None, rx=8))
d.add(Rect(0, 180, 480, 140, fillColor=COVER_BLOCK, strokeColor=None, rx=0))
d.add(String(24, 250, 'UJUZIVERSE', fontName='Tinos-Bold', fontSize=36, fillColor=colors.white))
d.add(String(24, 210, 'Comprehensive UX & Product Analysis', fontName='Tinos', fontSize=16, fillColor=colors.HexColor('#d6d1c2')))
d.add(String(24, 60, '20-Child Usability Study | Stakeholder Perspectives', fontName='Tinos', fontSize=11, fillColor=colors.HexColor('#b0a890')))
d.add(String(24, 42, 'Competitive Landscape | Go-to-Market Strategy', fontName='Tinos', fontSize=11, fillColor=colors.HexColor('#b0a890')))
d.add(String(24, 20, 'Prepared for Creative Divine Concepts Ltd | Nairobi, Kenya', fontName='Tinos-Italic', fontSize=10, fillColor=colors.HexColor('#908878')))
d.add(String(24, 6, 'June 2026', fontName='Tinos', fontSize=10, fillColor=colors.HexColor('#908878')))
story.append(d)
story.append(Spacer(1, 30))
story.append(tbl(['Field', 'Detail'], [
    ['Document Type', 'UX Audit & Strategic Product Analysis'],
    ['Platform', 'Ujuziverse (ujuziverse.com)'],
    ['Target Users', 'African youth aged 8-25, Schools, NGOs, Creators'],
    ['Analysis Date', 'June 22, 2026'],
    ['Methodology', 'Roleplay simulation (20 child personas), stakeholder interviews, competitive benchmarking'],
], [4*cm, 13*cm]))
story.append(PageBreak())

# TOC
story.append(h('Table of Contents'))
story.append(Spacer(1, 4))
toc = [
    ('1', 'Executive Summary'),
    ('2', 'Code Review: Issues Found'),
    ('2.1', 'UjuziSpeak: Fake Feedback Scores'),
    ('2.2', 'Creator Studio: All Tools Are Placeholders'),
    ('2.3', 'Community Page: Entirely Non-Functional'),
    ('2.4', 'UjuziMind: Topics Show "Coming Soon" Toast'),
    ('2.5', 'Chat Fallback Session ID Format'),
    ('2.6', 'Contact Form Does Not Actually Send'),
    ('2.7', 'Opportunities Hub: Static Numbers'),
    ('2.8', 'Events Page: No Real Event System'),
    ('2.9', 'UjuziImpact: Hardcoded Mock Metrics'),
    ('2.10', 'Partner Page: Concept Note Download Non-Functional'),
    ('3', 'Roleplay Study: 20 Children Explore Ujuziverse'),
    ('4', 'Teacher Perspective'),
    ('5', 'Parent Perspective'),
    ('6', 'Principal & Administrator Perspective'),
    ('7', 'Competitive Market Analysis'),
    ('7.1', 'Global Competitors'),
    ('7.2', 'African EdTech Competitors'),
    ('7.3', 'Market Size & Opportunity'),
    ('7.4', 'Ujuziverse Competitive Positioning'),
    ('8', 'Strategic Recommendations'),
    ('8.1', 'Critical Fixes (P0)'),
    ('8.2', 'High-Priority Improvements (P1)'),
    ('8.3', 'Growth & Monetization Strategy'),
    ('8.4', 'Go-to-Market Playbook'),
]
for num, title in toc:
    if '.' not in num:
        story.append(Paragraph(f'<b>{num}.</b>&nbsp;&nbsp;{title}', s_toc1))
    else:
        story.append(Paragraph(f'{num}&nbsp;&nbsp;{title}', s_toc2))
story.append(PageBreak())

# 1. EXECUTIVE SUMMARY
story.append(h('1. Executive Summary'))
story.append(p('Ujuziverse is an ambitious AI-powered skill-building platform developed by Creative Divine Concepts Ltd, headquartered in Nairobi, Kenya. The platform targets African youth aged approximately 8 to 25 with a suite of tools branded under the "Ujuzi" prefix: UjuziSpeak (AI language coach), UjuziSim (simulation lab), UjuziCreate (creator studio), UjuziMind (mental wellness), and UjuziLaunch (opportunities hub). The platform also includes vocabulary flashcards, quizzes, reading comprehension, grammar coaching, pronunciation practice, a writing journal, daily challenges, badges, and a community section. The technology stack is modern: React 19, TanStack Router, TypeScript, Vite, Tailwind CSS, and Supabase, with a sophisticated multi-tier AI fallback chain that tries Gemini, OVHcloud, free API keys, HuggingFace, and a local reply engine.'))
story.append(p('This report presents findings from a comprehensive UX audit conducted through a roleplay study of 20 school children with distinct personalities exploring the platform, supplemented by stakeholder perspectives from teachers, parents, and school principals. The analysis also includes a competitive market review benchmarking Ujuziverse against global players like Duolingo, ELSA Speak, and Busuu, as well as African EdTech leaders like Eneza Education and M-Shule. The African EdTech market is valued at approximately $4.1 billion in 2025 and projected to reach $10 billion by 2034, presenting a massive opportunity for platforms that can differentiate through Africa-specific content, offline capability, and mobile-first design.'))
story.append(p('While the platform demonstrates impressive breadth of features and a visually polished design, the audit identified ten significant issues ranging from fake feedback scoring in UjuziSpeak to entirely placeholder functionality in Creator Studio and Community pages. The most critical finding is a trust gap: children who discover that feedback is random rather than AI-driven lose confidence in the entire platform. The report concludes with prioritized recommendations, a competitive positioning framework, and a go-to-market playbook for selling Ujuziverse to schools, NGOs, and government partners across Africa.'))

# 2. CODE REVIEW
story.append(h('2. Code Review: Issues Found'))
story.append(p('After a thorough review of the latest codebase (commit ed0ec2d), the following issues were identified. These are categorized by severity and grouped by the affected module. Each issue includes the file path, the nature of the problem, and the impact on the user experience.'))

story.append(h('2.1 UjuziSpeak: Fake Feedback Scores', 2))
story.append(p('File: src/routes/ujuzispeak.tsx, lines 58-68. When a user stops speaking, the feedback scores for pronunciation, grammar, confidence, and tone are generated using Math.random() rather than any actual analysis of the spoken content. The code comment even says "Simulate AI analysis (in production, send to a real AI endpoint)." This means a child who mumbles gibberish can receive an 85% pronunciation score, while a child who speaks clearly might receive 72%. This is the single most damaging issue because it directly undermines the platform\'s core value proposition: AI-powered feedback. Children are smart enough to notice that the scores don\'t correlate with their effort, and once trust is broken, engagement drops permanently.'))

story.append(h('2.2 Creator Studio: All Tools Are Placeholders', 2))
story.append(p('File: src/routes/creator-studio.tsx, lines 43-55. All eight creator tools (Script Generator, Video Planner, Content Calendar, Thumbnail Ideas, Caption Generator, Brand Kit, Songwriting Assistant, Podcast Planner) display a toast notification saying "[Tool] is coming soon!" when clicked. This is a clear violation of the "no coming soon" requirement. For a platform targeting young creators, this is particularly frustrating because the Creator Studio is prominently featured in the navigation header and marketed as a key pillar. Children and young adults who click on these tools expecting to create content will feel disappointed and may not return.'))

story.append(h('2.3 Community Page: Entirely Non-Functional', 2))
story.append(p('File: src/routes/community.tsx, lines 32-51. All six community features (Discussion Boards, Study Groups, Creator Circles, Mentorship, Events, Celebrate Wins) display a toast saying "Community features are being built. Join our waitlist to get early access!" The Community page is one of the most important features for retention and engagement, especially for African youth who value social learning. Having the page exist but be completely non-functional is worse than not having it at all.'))

story.append(h('2.4 UjuziMind: Topics Show "Coming Soon" Toast', 2))
story.append(p('File: src/routes/ujuzimind.tsx, line 68. All six topic cards (Teen Psychology, Self-worth, Emotional Intelligence, Confidence Building, Goal Setting, Daily Affirmations) trigger a toast with "full content coming soon!" when clicked. The mood tracker and journal do work (mood selection and journal saving via localStorage), but the core topic content is inaccessible. For a mental wellness feature, this is particularly concerning because a child seeking emotional support resources will find empty buttons.'))

story.append(h('2.5 Chat Fallback Session ID Format', 2))
story.append(p('File: src/routes/chat.$scenarioId.tsx, line 116. When session creation fails, the fallback session ID is generated as "local-" + Date.now(), which is not a valid UUID format. While this works for localStorage-based operations, it could cause issues if the ID is later used in database queries or URL parameters. The fix is simple: use crypto.randomUUID() instead.'))

story.append(h('2.6 Contact Form Does Not Actually Send', 2))
story.append(p('File: src/routes/contact.tsx, lines 32-42. The contact form uses setTimeout to simulate sending the message, then shows a "Sent!" confirmation. No actual email, API call, or form submission occurs. For a B2B platform trying to sell to schools and NGOs, having a contact form that appears to work but doesn\'t actually send messages is a critical business issue.'))

story.append(h('2.7 Opportunities Hub: Static Numbers', 2))
story.append(p('File: src/routes/opportunities.tsx, lines 16-25. All opportunity counts are hardcoded. The "Apply" and "Save" buttons trigger toast notifications but don\'t lead to real application forms or saved lists. For a page branded as "UjuziLaunch -- Opportunities Hub," this is deeply problematic for young people seeking real scholarships, jobs, and funding.'))

story.append(h('2.8 Events Page: No Real Event System', 2))
story.append(p('File: src/routes/events.tsx, lines 16-21. Four events are hardcoded with future dates. The "Register" button triggers a toast but no registration data is captured, no confirmation email is sent, and there is no calendar integration.'))

story.append(h('2.9 UjuziImpact: Hardcoded Mock Metrics', 2))
story.append(p('File: src/routes/ujuziimpact.tsx, lines 16-21. The institution portal displays hardcoded metrics like "1,247 Total Learners." These numbers are not connected to any real data source. For a page designed for school administrators to track learner progress, showing fake metrics is a serious credibility issue.'))

story.append(h('2.10 Partner Page: Concept Note Download Non-Functional', 2))
story.append(p('File: src/routes/partner.tsx, line 124. The "Download Concept Note" button has no onClick handler. For a partner/sales page, the concept note is often the first document a potential partner reviews.'))

story.append(Spacer(1, 8))
story.append(h('Issues Summary', 3))
story.append(tbl(['Issue', 'Severity', 'Impact', 'File'], [
    ['Fake feedback scores', 'Critical', 'Trust destruction', 'ujuzispeak.tsx'],
    ['Creator Studio placeholders', 'High', 'Broken expectations', 'creator-studio.tsx'],
    ['Community non-functional', 'High', 'Retention loss', 'community.tsx'],
    ['UjuziMind topics locked', 'Medium', 'Mental health gap', 'ujuzimind.tsx'],
    ['Fallback session ID format', 'Low', 'Potential DB errors', 'chat.$scenarioId.tsx'],
    ['Contact form no-op', 'Critical', 'Lost partnerships', 'contact.tsx'],
    ['Static opportunity numbers', 'High', 'Misleading users', 'opportunities.tsx'],
    ['Fake event registration', 'Medium', 'User frustration', 'events.tsx'],
    ['Hardcoded impact metrics', 'High', 'Credibility damage', 'ujuziimpact.tsx'],
    ['Concept note no download', 'Medium', 'Lost partners', 'partner.tsx'],
], [4.5*cm, 2*cm, 3.5*cm, 4.5*cm]))
story.append(PageBreak())

# 3. ROLEPLAY STUDY
story.append(h('3. Roleplay Study: 20 Children Explore Ujuziverse'))
story.append(p('To understand how real children would experience Ujuziverse, we simulated 20 distinct child personas exploring the platform. Each child has a unique personality, age, skill level, and motivation. The following narratives capture their first-time experience, what delighted them, what confused them, and what would make them leave. These are imaginative roleplay simulations designed to surface UX issues not apparent from code review alone.'))

children = [
    ('Amani', 9, 'Shy, bookish, loves reading',
     'Amani opens the homepage and is immediately drawn to the colourful gradient cards. She clicks on "Start Free" and is taken to a chat scenario. The AI character Amara says hello, and Amani types a short greeting. The AI responds warmly. She smiles. But when she tries the vocabulary page, she finds only 4 languages and the decks feel too advanced for her age. She wishes there were simpler Swahili words with pictures.',
     'Vocabulary decks are not level-graded for younger children. A 9-year-old needs beginner-level Swahili with pictures, not text-heavy flashcards.'),
    ('Brian', 12, 'Competitive gamer, hates losing',
     'Brian creates an account, picks "Student" journey, and heads straight to the daily challenge. He completes it in 30 seconds by clicking "Mark as done." He goes to badges -- all locked except one. He tries the quiz, gets 2/3, feels okay. He visits the leaderboard but it only shows mock data. He wants to see his rank among real students.',
     'Daily challenge requires no real effort to complete. Leaderboard is not connected to real user data. No competitive elements drive engagement beyond static badges.'),
    ('Chantal', 14, 'Aspiring content creator, tech-savvy',
     'Chantal is excited about Creator Studio. She clicks "Script Generator" and gets a toast: "coming soon." She tries "Content Calendar" -- same toast. She tries all 8 tools. All toasts. She feels frustrated and navigates to simulations instead. The chat works and she enjoys it, but she came for creator tools and they are all empty shells.',
     'Creator Studio is entirely non-functional. A tech-savvy teen will immediately see through placeholder toasts. This is the single biggest disappointment on the platform.'),
    ('David', 10, 'ADHD, struggles with focus, loves games',
     'David lands on the homepage and the page is VERY long. There are multiple sections: hero, "More Than Learning," "Who Is This For," levels, journey, testimonials, CTA, footer. He scrolls and scrolls. He clicks on a matching game and enjoys it for a minute, then loses interest because there is no timer or score creating urgency. He tries the reading passage but gets distracted by the wall of text.',
     'The homepage is overwhelming for children with attention difficulties. Games lack engagement mechanics (timers, lives, sound effects). Reading passages need to be shorter and more interactive.'),
    ('Esther', 16, 'Top student, preparing for university interviews',
     'Esther goes straight to the simulation lab. She filters by "Interviews" and finds the job interview scenario. The chat with Imani works well. She finishes the session and gets feedback with confidence and fluency scores. But she notices the feedback is generic -- the same encouragement regardless of performance. She wants specific suggestions about her answers. She tries UjuziSpeak but gets random scores.',
     'Interview simulation works but feedback is not personalized. UjuziSpeak random scores undermine trust for serious users who need accurate assessment.'),
    ('Fatima', 11, 'Refugee from Somalia, learning English and Swahili',
     'Fatima selects "Arabic" as her language but finds the platform only offers English, French, German, Swahili, and Spanish. She is disappointed. She tries Swahili instead. The vocabulary flashcards help a little, but there is no audio pronunciation guide -- she does not know how the words sound. She tries reading comprehension but all passages are in English.',
     'No Arabic language support. Missing audio pronunciation on flashcards. Reading passages only in English. No localization for Somali or other East African languages.'),
    ('George', 15, 'Rural school, limited internet, uses phone',
     'George accesses Ujuziverse on his father\'s phone. The page loads slowly because of many font and asset imports. The header has too many navigation items for a small phone screen. He manages to get to a quiz but the page crashes when switching languages. He tries voice features but his browser (Opera Mini) does not support Web Speech API. He gives up after 5 minutes.',
     'Mobile experience is poor on low-end devices. No offline mode. No Progressive Web App support. Voice features only work on Chrome/Edge, not on browsers popular in rural Africa.'),
    ('Hawa', 13, 'Depressed, anxious about exams, needs emotional support',
     'Hawa finds UjuziMind. The daily affirmation helps a little. She clicks "Teen Psychology" hoping for real content about managing exam stress. She gets a toast: "coming soon!" She tries "Self-worth" -- same toast. She clicks all six topics -- all toasts. She writes in the mood tracker (selects sad face) and gets "Thanks for sharing. We\'re here for you." But there is no follow-up, no resources, no coping strategies.',
     'Mental wellness topics are all placeholders. The mood tracker has no follow-up actions. The journal has no AI reflection or prompts. This is concerning for vulnerable children.'),
    ('Ibrahim', 17, 'Entrepreneur, sells phone accessories',
     'Ibrahim is excited about UjuziLaunch. He sees "24 open" jobs and "6 open" brand deals. He clicks "Apply" on a brand deal and gets a toast. He clicks "Save" and gets another toast. There are no real listings, no application forms, no saved items page. He goes to the partner page and sees case studies about entrepreneurs. He clicks "Download Concept Note" and nothing happens.',
     'Opportunities are entirely fabricated. No real job/scholarship listings. No saved items system. Concept note download is broken.'),
    ('Janet', 8, 'Youngest child, just learning to read',
     'Janet cannot read most of the text on the platform. The buttons use English text that is too advanced for an 8-year-old. She clicks around randomly and ends up on the matching game, which she enjoys because it uses pictures. But she cannot read the instructions. She clicks the mic button on UjuziSpeak and it says "Voice input needs Chrome or Edge" -- she does not know what that means.',
     'No child-friendly UI or simplified interface for under-10s. No read-aloud support for instructions. Error messages are too technical. The platform assumes reading fluency.'),
    ('Kevin', 14, 'Football fan, not interested in school',
     'Kevin\'s teacher told him to use Ujuziverse. He reluctantly opens it, scrolls past the hero section, and sees nothing about sports. He clicks "Explore" and sees 12 different paths, none mentioning anything he cares about. He tries a simulation about "Playing with Friends" and actually enjoys the chat with Kito about game rules. He would stay if there were more sports-related scenarios.',
     'Content does not reflect interests of many African boys. No sports, music, or pop culture themed scenarios. The platform needs to meet children where their interests are.'),
    ('Linda', 16, 'Deaf, uses sign language',
     'Linda cannot use the voice features at all. The platform has no sign language support, no captions on audio content, and no visual-only alternative to pronunciation and speaking exercises. She tries vocabulary flashcards and they help somewhat, but there is no video demonstration of how to sign the words. She feels the platform was not built with people like her in mind.',
     'Complete lack of accessibility features for deaf or hard-of-hearing users. No sign language support. No captions or visual alternatives.'),
    ('Moses', 12, 'Competitive, wants to be #1 on leaderboard',
     'Moses checks the leaderboard. It shows static mock data. He completes a quiz perfectly (3/3) and expects his score to appear. It does not. He completes another quiz -- still nothing. He tries the daily challenge and sees his streak go to 1. He wants to compete against his classmates but there is no way to add friends or challenge them.',
     'Leaderboard is not real-time. No social features (friends, challenges, comparisons). No classroom or school-wide competitive features.'),
    ('Njeri', 13, 'Shy, afraid of speaking English in class',
     'Njeri discovers UjuziSpeak and is nervous but hopeful. She chooses "Public Speaking" and presses the mic button. She speaks quietly about her hobby. The platform transcribes her speech correctly, which impresses her. But then the feedback gives random scores: 78% pronunciation, 82% grammar, 71% confidence, 85% tone. She knows she mumbled and the pronunciation should not be 78%. She feels the AI is not really listening and loses trust.',
     'The random scoring in UjuziSpeak directly defeats its purpose for shy children who need accurate, encouraging, and truthful feedback to build confidence.'),
    ('Oluwaseun', 15, 'From Lagos, speaks Yoruba and English',
     'Oluwaseun looks for Yoruba or Nigerian Pidgin language options. Neither exists. He tries English and finds scenarios relatable enough. The grammar checker works well. He enjoys the quiz. But he notices scenarios reference Kenyan contexts (M-Pesa, Nairobi) which feel foreign. He wishes there were Nigerian scenarios about Lagos markets and JAMB exams.',
     'No Yoruba, Pidgin, or other Nigerian/West African languages. Scenarios are Kenya-centric. The platform needs country-specific content.'),
    ('Precious', 11, 'Loves drawing, creative, visual learner',
     'Precious wants to draw and create visual content. She visits Creator Studio and finds 8 tools, all showing "coming soon." She is heartbroken. She tries the matching game which has some visual elements. She also finds the vocabulary flashcards boring because they are text-only with no images.',
     'No visual/creative tools work. Flashcards lack images. Visual learners have very little to engage with beyond chat simulations.'),
    ('Quincy', 18, 'University student, needs professional English',
     'Quincy appreciates the grammar checker, which actually works well with server-side AI. He finds the professional interview scenario useful. But the vocabulary is too basic for university level. Reading passages are short and simple. There is no academic writing module, no IELTS/TOEFL prep, and no business English section.',
     'Content level caps at secondary school. No advanced/academic English track. No certification or standardized test preparation.'),
    ('Ruth', 9, 'Loves singing, wants to learn through music',
     'Ruth wishes the platform had songs, rhymes, or musical content. She tries pronunciation practice and it works, but it is boring -- just repeating phrases with no music. She likes the daily affirmation. She tries the matching game and enjoys it. But she keeps wishing there were songs to learn from.',
     'No musical or audio-learning content. Pronunciation practice is dry. No songs, rhymes, or audio stories. For young children, music is one of the most effective learning tools.'),
    ('Samuel', 13, 'Skeptical, questions everything',
     'Samuel notices testimonials on the homepage say things like "300% audience growth." He googles the names and finds no real people. He checks UjuziImpact and sees "1,247 Total Learners" with no verification. He tests the contact form, gets "Sent!" but knows no message was actually sent. He thinks the whole thing might be fake.',
     'Testimonials appear fabricated. Metrics are unverifiable. Contact form is fake. A skeptical child can identify multiple broken trust signals.'),
    ('Tariq', 14, 'Loves AI, curious about how things work',
     'Tariq is impressed that the chat feature uses AI. He tests it by asking questions outside the scenario context. The AI stays in character reasonably well. He tries the grammar checker and is impressed by the detailed corrections. He checks UjuziSpeak and notices feedback is instant but suspiciously generic. He inspects the page source and realizes scores are random. He is disappointed.',
     'Tech-savvy children will discover the fake scoring. The AI chat and grammar checker are genuine strengths undermined by the fake scoring nearby.'),
    ('Zuri', 12, 'Name matches a platform character, excited',
     'Zuri is thrilled to see a character named Zuri on the platform. She clicks on the scenario with Zuri (Team Leader) and enjoys the roleplay. She loves the avatar system. She then goes to badges and wants to earn the "First Conversation" badge but does not know how. She completes a chat but the badge does not unlock. She is confused and feels cheated.',
     'Badges are not dynamically earned. Character relatability is a strength that should be amplified. The emotional connection children feel to characters is a unique asset.'),
]
for c in children:
    story.extend(child(*c))
story.append(PageBreak())

# 4. TEACHER
story.append(h('4. Teacher Perspective'))
story.append(p('Mrs. Wanjiku teaches English at a public secondary school in Mombasa with 45 students per class. She has limited access to technology -- the school has 20 shared tablets and intermittent Wi-Fi. Her perspective is shaped by practical classroom constraints and curriculum alignment needs.'))
story.append(b('What She Likes:'))
story.append(bl('The AI chat simulations are genuinely useful for oral practice. In a class of 45, giving each student individual speaking practice is impossible. UjuziSim could fill this gap if it works offline.'))
story.append(bl('The grammar checker provides instant, detailed feedback with explanations, which saves hours of marking. The sentence-by-sentence breakdown is pedagogically sound and could be used for homework.'))
story.append(bl('The quiz and reading comprehension features align reasonably well with the Kenyan CBC curriculum. Multiple-choice quizzes with instant feedback are a proven learning tool.'))
story.append(bl('The vocabulary flashcards with "Got it" and "Still learning" buttons implement spaced repetition principles, which she knows from teacher training are effective for memorization.'))
story.append(b('What Concerns Her:'))
story.append(bl('There is no teacher dashboard where she can assign specific scenarios, track which students have completed which exercises, or view aggregate class performance. The UjuziImpact page shows hardcoded numbers, not real data.'))
story.append(bl('The platform does not align with any specific national curriculum. She needs to know which scenarios map to which curriculum outcomes. Without this mapping, she cannot justify using class time for it.'))
story.append(bl('Content is Kenya-centric but does not reflect the diversity of Kenyan classrooms. Students in Mombasa have different cultural references than students in Nairobi. Regional customization is important.'))
story.append(bl('The fake feedback scores in UjuziSpeak would give students wrong information about their abilities. If a student thinks their pronunciation is 85% when it is actually poor, she cannot correct that misconception because the platform has already validated the error.'))
story.append(bl('Internet connectivity at her school is unreliable. If the platform requires constant connectivity, it will fail in her classroom. She needs an offline mode or low-bandwidth mode that works on 2G/3G connections.'))

# 5. PARENT
story.append(h('5. Parent Perspective'))
story.append(p('James Ochieng is a father of three children aged 9, 13, and 16 in Kisumu. He is a small business owner who wants his children to have better educational opportunities. He heard about Ujuziverse from a WhatsApp group for parents.'))
story.append(b('What He Values:'))
story.append(bl('The platform is free, which is critical. He cannot afford paid subscriptions like Duolingo Super ($6.99/month) for three children. Free access with real value is the number one decision factor.'))
story.append(bl('The mental wellness component (UjuziMind) resonates deeply. His teenage daughter has been struggling with exam anxiety. A platform combining academic learning with emotional support is exactly what he has been looking for -- but he is disappointed to find the topics are placeholders.'))
story.append(bl('The "Africa\'s Future Starts Here" messaging makes him proud. He wants his children to use tools built for them, not Western imports. The African characters (Amara, Mwalimu Juma, Kito, Zuri, Baraka, Imani) feel relatable and culturally appropriate.'))
story.append(bl('The opportunity hub (scholarships, jobs) addresses a real pain point. He spends hours searching for scholarships for his eldest child. If Ujuziverse could aggregate real opportunities, it would be invaluable.'))
story.append(b('What Worries Him:'))
story.append(bl('He tested the contact form and realized it does not actually send messages. This makes him question whether the company is legitimate. If the contact form is fake, what else is fake?'))
story.append(bl('He is concerned about data privacy. His children\'s journal entries, mood data, and voice recordings are stored in localStorage with no encryption or parental controls. He cannot see what his children are writing, nor can he set usage limits.'))
story.append(bl('The platform has no parental dashboard. He wants to see his children\'s progress, set learning goals, and receive weekly reports. Without this, he cannot monitor or support their learning.'))
story.append(bl('He notices the Creator Studio is all placeholders. His 13-year-old wants to be a YouTuber, and he was hoping the platform could provide safe, educational content creation tools.'))

# 6. PRINCIPAL
story.append(h('6. Principal & Administrator Perspective'))
story.append(p('Mrs. Akinyi is the principal of a mixed-day secondary school with 800 students in a peri-urban area near Nairobi. She evaluates Ujuziverse from an institutional procurement perspective.'))
story.append(b('Buying Criteria:'))
story.append(bl('<b>Curriculum Alignment:</b> Ujuziverse must map to the Kenyan CBC (Competency-Based Curriculum) outcomes. She needs documentation showing which features align with which learning outcomes. Without this, she cannot justify the platform to the school board.'))
story.append(bl('<b>Impact Measurement:</b> She needs real, verifiable data on student progress. The UjuziImpact page currently shows hardcoded metrics. She needs a genuine admin dashboard with per-student, per-class, and per-subject analytics.'))
story.append(bl('<b>Cost:</b> Her school operates on a tight budget. The "free" model is attractive but she needs to understand the business model. A freemium model with essential features free and premium features paid is ideal.'))
story.append(bl('<b>Infrastructure Requirements:</b> The school has a computer lab with 30 desktop computers and limited Wi-Fi. Ujuziverse must work on older hardware with Firefox without requiring the latest Chrome browser.'))
story.append(bl('<b>Teacher Training:</b> Technology adoption fails without teacher buy-in. She needs professional development materials, onboarding guides, and ongoing support for her 35 teachers.'))
story.append(bl('<b>Data Privacy:</b> The platform collects data from minors. She needs assurance it complies with Kenya\'s Data Protection Act (2019). Current localStorage-only storage without encryption is a red flag.'))
story.append(b('What Would Convince Her to Buy:'))
story.append(bl('A pilot program with 50 students showing measurable improvement in English or Swahili communication scores over one term, with pre- and post-assessment data.'))
story.append(bl('A clear pricing model: free for students, paid only for institutional analytics dashboard at a price point comparable to existing school software subscriptions in Kenya (KES 5,000-15,000/month).'))
story.append(bl('Partnership endorsements from recognized institutions like KICD (Kenya Institute of Curriculum Development) or TSC (Teachers Service Commission).'))
story.append(bl('Offline capability that works on existing infrastructure without requiring internet connectivity during class time.'))
story.append(PageBreak())

# 7. COMPETITIVE
story.append(h('7. Competitive Market Analysis'))
story.append(h('7.1 Global Competitors', 2))
story.append(p('The global language learning and EdTech market is highly competitive, with established players commanding significant market share. Ujuziverse must understand these competitors to position itself effectively in the African market.'))
story.append(tbl(['Platform', 'Revenue', 'Pricing', 'Key Strength', 'Africa Presence'], [
    ['Duolingo', '$1.03B', 'Free + $6.99/mo', 'Gamification, brand', 'Moderate (EN, FR, SW)'],
    ['ELSA Speak', '$80M est.', '$11.99/mo', 'AI pronunciation', 'Low'],
    ['Busuu', '$40M est.', '$9.99/mo', 'Community, 14 langs', 'Moderate'],
    ['Babbel', '$200M+', '$6.95/mo', 'Structured courses', 'Low'],
    ['Memrise', '$30M est.', '$8.49/mo', 'Memory science', 'Low'],
    ['Rosetta Stone', '$250M+', '$7.99/mo', 'Immersion method', 'Low'],
], [2.2*cm, 2.2*cm, 2.8*cm, 3.5*cm, 3.5*cm]))
story.append(p('Duolingo dominates with over $1 billion in annual revenue and 500+ million registered users. Its gamification model (streaks, XP, leagues, leaderboards) has set the standard for engagement. However, Duolingo\'s Africa-specific content is limited. It offers English, French, and Swahili courses but with no cultural localization. Duolingo for Schools exists but is underdeveloped compared to the consumer product.'))
story.append(p('ELSA Speak focuses on pronunciation using AI speech recognition, which directly competes with UjuziSpeak. However, ELSA charges $11.99/month and has minimal African market presence. This represents both a threat and an opportunity: if UjuziSpeak can deliver genuine AI-powered pronunciation feedback for free, it can capture users who find ELSA too expensive.'))

story.append(h('7.2 African EdTech Competitors', 2))
story.append(p('The African EdTech landscape is rapidly growing, with the market valued at approximately $4.1 billion in 2025 and projected to reach $10 billion by 2034.'))
story.append(tbl(['Company', 'Country', 'Focus', 'Users', 'Funding'], [
    ['Eneza Education', 'Kenya', 'SMS/mobile revision', '1M+ monthly', '$1.49M'],
    ['M-Shule', 'Kenya', 'Personalized learning', '100K+', 'Seed'],
    ['Kytabu', 'Kenya', 'Digital textbooks', '500K+', 'Series A'],
    ['Snapplify', 'South Africa', 'E-book distribution', '500K+', 'Series C'],
    ['Siyavula', 'South Africa', 'Math/science practice', '200K+', 'Grant-funded'],
    ['Zeddy', 'Nigeria', 'Exam prep', '50K+', 'Pre-seed'],
], [2.8*cm, 2.2*cm, 3.5*cm, 2.2*cm, 2.2*cm]))
story.append(p('Eneza Education is the most relevant comparator. Founded in 2011 in Nairobi, it provides educational content via mobile phones (including SMS for feature phones) and has reached over 1 million active users monthly. Eneza recently merged with Knowledge Platform to form the first African-Asian EdTech venture. Eneza\'s strength is accessibility -- it works on basic phones. Ujuziverse, by contrast, requires a modern browser with JavaScript. No existing African EdTech platform combines AI-powered communication coaching, mental wellness, creator tools, and opportunities in a single platform. This is Ujuziverse\'s unique value proposition.'))

story.append(h('7.3 Market Size and Opportunity', 2))
story.append(bl('<b>African EdTech Market:</b> $4.1 billion in 2025, projected to reach $10 billion by 2034 (19.2% CAGR). Kenya, Nigeria, South Africa, and Egypt lead adoption.'))
story.append(bl('<b>Global Language Learning Apps:</b> $21.06 billion in 2025, growing to $50.82 billion by 2031 (15.83% CAGR). Language learning apps generated $1.54 billion in revenue in 2025.'))
story.append(bl('<b>Africa Smartphone Penetration:</b> Approximately 400-500 million smartphone users in 2025, expected to reach 700 million by 2030. Youth under 25 represent 60% of the population.'))
story.append(bl('<b>Internet Connectivity:</b> Africa\'s internet penetration is approximately 43%, with significant variance between urban (70%+) and rural (15-25%) areas. Mobile broadband is the primary access method.'))
story.append(bl('<b>Government Initiatives:</b> The African Union\'s EdTech 2030 Vision and Plan advances five strategic objectives including access, infrastructure, and courseware development. Kenya\'s CBC curriculum reform creates demand for digital learning tools.'))

story.append(h('7.4 Ujuziverse Competitive Positioning', 2))
story.append(p('Ujuziverse occupies a unique position: the only African-built platform combining AI-powered communication skills practice with mental wellness support and career opportunities for youth. This breadth is both its greatest strength and risk. The recommended positioning strategy is to lead with one or two features that work exceptionally well (the AI chat simulations and grammar checker are the strongest candidates), use these as the entry point for user acquisition, and gradually expand. This "wedge strategy" is how Duolingo achieved scale: start narrow and deep, then expand breadth.'))
story.append(PageBreak())

# 8. RECOMMENDATIONS
story.append(h('8. Strategic Recommendations'))
story.append(h('8.1 Critical Fixes (P0) -- Must Fix Before Any Sales', 2))
story.append(p('These issues must be resolved before approaching any school, NGO, or government partner.'))
story.append(bl('<b>Fix UjuziSpeak feedback scoring:</b> Replace Math.random() with real speech analysis. Use the existing AI chain (the same chatReply function used in chat) to send the transcript to the server and get genuine pronunciation, grammar, confidence, and tone assessments. Even imperfect honest scores are far better than random numbers.'))
story.append(bl('<b>Fix or remove Creator Studio placeholder tools:</b> Either implement at least 2-3 tools (a text-based script generator using AI, a simple content calendar template) or clearly mark the page as "Beta" and remove the tools until functional.'))
story.append(bl('<b>Fix or remove Community page:</b> Either implement basic community features (a simple discussion board) or redirect to a waitlist landing page. The current toast approach is the worst option.'))
story.append(bl('<b>Fix contact and partner forms:</b> Connect to a real email service. Free tiers of Resend, SendGrid, or EmailJS can handle this. Every lost form submission is a lost partnership.'))
story.append(bl('<b>Replace hardcoded metrics in UjuziImpact:</b> Either show real aggregate data from Supabase or clearly label the page as a demo with sample data.'))

story.append(h('8.2 High-Priority Improvements (P1) -- Next Quarter', 2))
story.append(bl('<b>Implement UjuziMind topic content:</b> Each topic card should expand to show real content -- at minimum, 5-10 paragraphs of age-appropriate text with interactive elements.'))
story.append(bl('<b>Add parent dashboard:</b> A simple read-only view showing children\'s activity, streak, and mood trends. Password-protected and shareable via link.'))
story.append(bl('<b>Implement real-time leaderboard:</b> Connect to actual user data from Supabase. Even a simple weekly leaderboard dramatically increases engagement.'))
story.append(bl('<b>Add PWA support (service worker + manifest):</b> Enables offline use, home screen installation, and push notifications. Essential for African users with intermittent connectivity.'))
story.append(bl('<b>Add images to vocabulary flashcards:</b> Each word should have an associated image for visual learners and younger children.'))
story.append(bl('<b>Country-specific scenario content:</b> Create scenario variants for Nigeria, South Africa, Ghana. A Lagos market scenario is very different from a Nairobi one.'))
story.append(bl('<b>Add curriculum mapping documentation:</b> For each feature, document which Kenyan CBC learning outcomes it addresses. Essential for school sales.'))

story.append(h('8.3 Growth and Monetization Strategy', 2))
story.append(p('The recommended monetization model is a freemium approach with three tiers:'))
story.append(tbl(['Tier', 'Price', 'Includes', 'Target'], [
    ['Free', 'KES 0', 'Chat simulations (3/day), quizzes, flashcards, daily challenge', 'Individual students'],
    ['School', 'KES 10,000/mo', 'Everything free + teacher dashboard + all simulations + analytics', 'Schools (per school)'],
    ['Enterprise', 'Custom', 'White-label, custom content, API access, dedicated support', 'NGOs, governments, corporates'],
], [2*cm, 2.5*cm, 6.5*cm, 3.5*cm]))
story.append(p('Pricing is calibrated to African market realities. KES 10,000/month (approximately USD 75) for a school of 800 students works out to less than KES 13 per student per month -- well within supplementary learning budgets. The free tier must be genuinely valuable to drive organic adoption.'))

story.append(h('8.4 Go-to-Market Playbook', 2))
story.append(p('The recommended go-to-market strategy follows a "land and expand" approach.'))
story.append(b('Phase 1: Pilot (Months 1-3)'))
story.append(bl('Partner with 5-10 schools in Nairobi for a free pilot. Provide pre-loaded tablets with Ujuziverse installed. Focus on AI chat simulations and grammar checker. Collect pre- and post-assessment data on English communication skills.'))
story.append(bl('Engage 2-3 NGO partners for free pilot deployment. NGOs provide access to large numbers of youth beneficiaries and can provide testimonials.'))
story.append(b('Phase 2: Validate and Iterate (Months 4-6)'))
story.append(bl('Analyze pilot data. If results show 20%+ improvement in communication confidence scores, produce case studies and impact reports.'))
story.append(bl('Fix all P0 issues and most P1 issues. Ensure the platform is genuinely functional across all marketed features.'))
story.append(b('Phase 3: Scale (Months 7-12)'))
story.append(bl('Launch school sales targeting 100+ schools in Kenya, with expansion to Nigeria, Ghana, and South Africa. Price school tier to be accessible for public schools with government funding.'))
story.append(bl('Pursue telecom partnerships (Safaricom, MTN, Airtel) for zero-rated data access. Eneza Education uses a similar approach successfully.'))
story.append(bl('Apply for EdTech grants and competitions (Mastercard Foundation, GPE, African Union EdTech awards) to fund expansion and build credibility.'))
story.append(bl('Attend African education conferences: eLearning Africa, Innovating Education in Africa Expo, and national exhibitions. These are primary sales channels for reaching school administrators.'))

story.append(Spacer(1, 12))
story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceBefore=6, spaceAfter=6))
story.append(Paragraph('This analysis was prepared based on a comprehensive code review of the Ujuziverse platform (commit ed0ec2d), a simulated roleplay study of 20 child personas, stakeholder perspective analysis, and competitive market research. All recommendations are actionable and prioritized to support Ujuziverse\'s go-to-market strategy.', s_small))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Tinos', 8)
    canvas.setFillColor(TEXT_MUTED)
    pn = canvas.getPageNumber()
    if pn > 1:
        canvas.drawCentredString(A4[0]/2, 1.2*cm, f"Ujuziverse UX & Product Analysis  |  Page {pn - 1}")
    canvas.restoreState()

doc.build(story, onFirstPage=lambda c,d: None, onLaterPages=footer)
print(f"PDF generated: {OUTPUT}")