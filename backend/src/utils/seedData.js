import Novel from "../models/Novel.model.js";
import ForumThread from "../models/ForumThread.model.js";
import ForumComment from "../models/ForumComment.model.js";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";

export const seedDatabase = async () => {
  try {
    const novelCount = await Novel.countDocuments();
    if (novelCount > 0) {
      console.log("Database already seeded with novels.");
      return;
    }

    console.log("Seeding database with novels and forum discussions...");

    // 1. Ensure at least 3 community users exist for authors/commenters
    let users = await User.find({ is_verified: true }).limit(5);
    if (users.length < 3) {
      const hashedPassword = await bcrypt.hash("Password123!", 10);
      const communityUsers = [
        {
          display_name: "ShadowReader",
          email: "shadow@noveland.io",
          password: hashedPassword,
          is_verified: true,
          role: "user",
          about: "Avid reader of cultivation and cosmic horror novels.",
        },
        {
          display_name: "AstraScholar",
          email: "astra@noveland.io",
          password: hashedPassword,
          is_verified: true,
          role: "moderator",
          about: "Analyzing magic systems and universe lore.",
        },
        {
          display_name: "LunarArchivist",
          email: "lunar@noveland.io",
          password: hashedPassword,
          is_verified: true,
          role: "user",
          about: "Fantasy and sci-fi translation enthusiast.",
        },
      ];

      for (const u of communityUsers) {
        const existing = await User.findOne({ email: u.email });
        if (!existing) {
          await User.create(u);
        }
      }
      users = await User.find({ is_verified: true }).limit(5);
    }

    const u1 = users[0]?._id;
    const u2 = users[1]?._id || u1;
    const u3 = users[2]?._id || u1;

    // 2. Seed Novels
    const novelsData = [
      {
        title: "Lord of the Cosmic Stars",
        author: "Cuttlefish",
        rating: 4.9,
        chapters: 1432,
        category: "Fantasy",
        tags: ["Mystery", "Cultivation", "Cosmic Horror", "Steampunk"],
        cover:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        description:
          "In the depths of space and Victorian mist, celestial pathways stir. Follow Roland as he balances potions, madness, and divination to ascend the throne of the Fool.",
        views: "1.2M",
        status: "Completed",
      },
      {
        title: "Shadow Monarch: Genesis",
        author: "Chugong",
        rating: 4.8,
        chapters: 270,
        category: "Action",
        tags: ["Dungeon", "System", "Monsters", "Necromancer"],
        cover:
          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
        description:
          "When the double dungeon collapsed, only the weakest E-rank hunter awakened the sovereign authority of shadows and an infinite quest system.",
        views: "2.5M",
        status: "Completed",
      },
      {
        title: "The Alchemist's Odyssey",
        author: "Mingtian",
        rating: 4.7,
        chapters: 620,
        category: "Adventure",
        tags: ["Alchemy", "Magic", "Reincarnation", "Kingdom Building"],
        cover:
          "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        description:
          "Reborn in an empire that banned magical formulas, a modern chemical engineer uses modern atomic theory to revolutionize ancient potion crafting.",
        views: "890K",
        status: "Ongoing",
      },
      {
        title: "Chronicles of the Astral Sea",
        author: "Starlight",
        rating: 4.9,
        chapters: 890,
        category: "Sci-Fi",
        tags: ["Space Opera", "Mecha", "Strategy", "Galactic Empire"],
        cover:
          "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
        description:
          "Fleet command battles against primordial void leviathans across uncharted spiral galaxies. A tactical masterpiece combining starships with psychic pilots.",
        views: "640K",
        status: "Ongoing",
      },
      {
        title: "Grandmaster of the Nine Heavens",
        author: "Feng Ling",
        rating: 4.6,
        chapters: 1850,
        category: "Cultivation",
        tags: ["Dao", "Sword", "Revenge", "Immortality"],
        cover:
          "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80",
        description:
          "Betrayed by his celestial disciples, the Sword Emperor is reborn as a crippled youth in the mortal domain. Armed with ancient sword intents, he marches back to the Nine Heavens.",
        views: "1.7M",
        status: "Completed",
      },
      {
        title: "Whispers of the Eternal Rose",
        author: "Elena Rostova",
        rating: 4.8,
        chapters: 340,
        category: "Romance",
        tags: ["Villainess", "Nobility", "Time Loop", "Slow Burn"],
        cover:
          "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80",
        description:
          "Condemned to the guillotine five times, Duchess Luciana wakes up on her eighteenth birthday once more. This time, she abandons the crown prince and allies with the reclusive Duke of the North.",
        views: "930K",
        status: "Ongoing",
      },
    ];

    const createdNovels = await Novel.insertMany(novelsData);
    console.log(`Seeded ${createdNovels.length} novels.`);

    // 3. Seed Forum Threads
    const threadsData = [
      {
        title: "Welcome to Noveland Forum! Guidelines, novel tags & discussion rules",
        content: `Welcome to the official Noveland community forum!
        
Here you can:
- Post your theories on upcoming chapters
- Share character tier lists and magic system breakdowns
- Review newly translated web novels and give spoiler-free impressions
- Discuss plot twists with fellow readers

Please keep comments respectful, tag spoilers clearly when discussing raw/advance chapters, and support the official authors and scanlation teams!`,
        author: u2,
        category: "General",
        tags: ["Welcome", "Guidelines", "Community"],
        novel: null,
        isPinned: true,
        upvoteCount: 42,
        views: 1530,
        replyCount: 2,
      },
      {
        title: "Lord of the Cosmic Stars: Pathway Sequences & The Madness Factor Discussion",
        content: `What pathway do you consider the most dangerous yet rewarding in *Lord of the Cosmic Stars*? 
        
The Fool pathway has astonishing flexibility with divination, marionettes, and miraculous wishes, but the risk of losing control around Sequence 4 is terrifying. Contrast that with the Door pathway or Marauder pathway—do you think Roland could have survived with any other sequence group? 
        
Let's break down the potion formulas and mythical creature forms!`,
        author: u1,
        novel: createdNovels[0]._id,
        category: "Theories",
        tags: ["Cosmic Stars", "Magic Systems", "Lore Breakdown"],
        isPinned: false,
        upvoteCount: 28,
        views: 792,
        replyCount: 2,
      },
      {
        title: "Chapter 150+ in Shadow Monarch: How the Sovereign War changes everything",
        content: `Just caught up with the Sovereign War arc. The reveal about the Architect and the origins of the System blew my mind.
        
Usually dungeon hunter novels get stale after the protagonist becomes OP, but the pacing here keeps the stakes enormous. What were your favorite moments from this arc?`,
        author: u3,
        novel: createdNovels[1]._id,
        category: "Chapter Discussion",
        tags: ["Shadow Monarch", "Dungeons", "Spoilers"],
        isPinned: false,
        upvoteCount: 19,
        views: 512,
        replyCount: 1,
      },
      {
        title: "Top 5 Kingdom Building & Crafting Web Novels for 2026",
        content: `If you love *The Alchemist's Odyssey* and detailed world-building where economics, technology, and magic collide, here are my top picks:
        
1. The Alchemist's Odyssey (Chemistry meets ancient runes)
2. Release that Witch (Classic industrialization & magic)
3. Enlightened Empire (Diplomacy & logistical warfare)
4. Nebula's Civilization (Godhood & species evolution)
5. Overgeared (Item crafting progression)

What else belongs on this list? Drop your hidden gems below!`,
        author: u2,
        novel: createdNovels[2]._id,
        category: "Recommendations",
        tags: ["Kingdom Building", "Recommendations", "Crafting"],
        isPinned: false,
        upvoteCount: 35,
        views: 1140,
        replyCount: 2,
      },
      {
        title: "Is 'Grandmaster of the Nine Heavens' worth reading past chapter 500?",
        content: `I'm at chapter 480 right now. The first 300 chapters were pure hype with the sword intents and sect tournaments, but the latest heavenly realm ascension feels a bit slow. 
        
Does the pacing pick back up when he confronts the Third Heavenly Venerable? No major spoilers please, just want to know if it's worth continuing!`,
        author: u1,
        novel: createdNovels[4]._id,
        category: "Reviews",
        tags: ["Cultivation", "Pacing", "Review"],
        isPinned: false,
        upvoteCount: 14,
        views: 430,
        replyCount: 1,
      },
    ];

    const createdThreads = await ForumThread.insertMany(threadsData);
    console.log(`Seeded ${createdThreads.length} forum threads.`);

    // 4. Seed Comments
    const commentsData = [
      {
        thread: createdThreads[0]._id,
        author: u1,
        content: "So excited for this forum! Excited to see all the novel discussions and recommendations here.",
        likeCount: 5,
      },
      {
        thread: createdThreads[0]._id,
        author: u3,
        content: "Bookmarking this page right away. Great work on the community hub!",
        likeCount: 3,
      },
      {
        thread: createdThreads[1]._id,
        author: u2,
        content: "Honestly, the Sleepless / Darkness pathway is heavily underrated. The stealth and pacification powers are amazing, but nothing beats The Fool's Spirit World traversal.",
        likeCount: 8,
      },
      {
        thread: createdThreads[1]._id,
        author: u3,
        content: "The Marauder pathway's ability to 'steal' thoughts and time is broken if you have the right artifacts. Can't wait for volume 2!",
        likeCount: 4,
      },
      {
        thread: createdThreads[2]._id,
        author: u1,
        content: "The shadow army expanding to over 100,000 soldiers with dragons was the pinnacle of the entire series. Peak adrenaline.",
        likeCount: 6,
      },
      {
        thread: createdThreads[3]._id,
        author: u3,
        content: "Great list! I'd also add 'Tales of the Reincarnated Lord' for anyone who loves military tactics.",
        likeCount: 7,
      },
      {
        thread: createdThreads[4]._id,
        author: u2,
        content: "Yes! Keep reading until chapter 520, the confrontation in the Starfall Pavilion is one of the top 3 battles in the entire novel!",
        likeCount: 9,
      },
    ];

    await ForumComment.insertMany(commentsData);
    console.log("Seeded forum comments successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
