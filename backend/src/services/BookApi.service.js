import "dotenv/config";

/**
 * Search RanobeDB API (v0) for light novels
 * https://ranobedb.org/api/docs/v0
 */
export const searchRanobeDb = async (query) => {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();

  try {
    const seriesUrl = `https://ranobedb.org/api/v0/series?q=${encodeURIComponent(
      cleanQuery
    )}&limit=6`;

    const res = await fetch(seriesUrl, {
      headers: {
        "User-Agent": "NovelandApp/1.0 (contact@noveland.io)",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.warn("RanobeDB series search returned status:", res.status);
      return [];
    }

    const data = await res.json();
    const seriesList = data.series || [];

    if (seriesList.length === 0) {
      // Try searching books endpoint if series empty
      const bookUrl = `https://ranobedb.org/api/v0/books?q=${encodeURIComponent(
        cleanQuery
      )}&limit=6`;
      const bookRes = await fetch(bookUrl, {
        headers: { "User-Agent": "NovelandApp/1.0" },
      });
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        return (bookData.books || []).map((b) => ({
          source: "RanobeDB",
          externalId: `ranobedb-book-${b.id}`,
          title: b.title || b.title_orig || "Light Novel",
          author: b.romaji_orig || "Light Novel Author",
          cover: b.image?.filename
            ? `https://images.ranobedb.org/${b.image.filename}`
            : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
          description: `Light novel volume indexed on RanobeDB (${b.lang?.toUpperCase() || "EN"}).`,
          category: "Fantasy",
          tags: ["Light Novel", "RanobeDB"],
          rating: 4.8,
          chapters: 1,
          views: "20K",
        }));
      }
      return [];
    }

    // Enrich top 4 series with detailed author, tags, and description
    const enriched = await Promise.all(
      seriesList.slice(0, 5).map(async (item) => {
        let author = "Light Novel Author";
        let description = "";
        let tags = ["Light Novel"];

        try {
          const detailRes = await fetch(
            `https://ranobedb.org/api/v0/series/${item.id}`,
            {
              headers: { "User-Agent": "NovelandApp/1.0" },
              signal: AbortSignal.timeout(3500),
            }
          );
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            const s = detailData.series || {};
            const authorStaff = s.staff?.find(
              (st) => st.role_type === "author"
            );
            if (authorStaff?.name) {
              author = authorStaff.romaji
                ? `${authorStaff.name} (${authorStaff.romaji})`
                : authorStaff.name;
            }
            if (s.book_description?.description) {
              description = s.book_description.description;
            } else if (s.description) {
              description = s.description;
            }
            if (s.tags && s.tags.length > 0) {
              tags = s.tags.slice(0, 5).map((t) => t.name);
            }
          }
        } catch (detailErr) {
          // If detail fails/times out, use fallback
        }

        const coverFilename = item.book?.image?.filename;
        const cover = coverFilename
          ? `https://images.ranobedb.org/${coverFilename}`
          : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80";

        return {
          source: "RanobeDB",
          externalId: `ranobedb-series-${item.id}`,
          title: item.title || item.title_orig,
          author,
          cover,
          description:
            description ||
            `Official light novel series with ${item.c_num_books || item.volumes?.count || "multiple"} volumes. Discuss chapters, characters, and illustrations on Noveland.`,
          category: normalizeCategory(tags[0] || "Fantasy"),
          tags: tags.length > 0 ? tags : ["Light Novel", "RanobeDB"],
          rating: 4.9,
          chapters: item.c_num_books || item.volumes?.count || 10,
          views: "35K",
        };
      })
    );

    return enriched;
  } catch (err) {
    console.error("RanobeDB search error:", err.message);
    return [];
  }
};

/**
 * Search Google Books API (with Open Library fallback)
 */
export const searchGoogleAndOpenLibrary = async (query) => {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  // 1. Try Google Books API
  try {
    const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      cleanQuery
    )}&maxResults=6${apiKey ? `&key=${apiKey}` : ""}`;

    const googleRes = await fetch(googleUrl);
    if (googleRes.ok) {
      const googleData = await googleRes.json();
      if (googleData.items && googleData.items.length > 0) {
        return googleData.items.map((item) => {
          const info = item.volumeInfo || {};
          let cover =
            info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "";
          if (cover && cover.startsWith("http://")) {
            cover = cover.replace("http://", "https://");
          }

          return {
            source: "Google Books",
            externalId: `google-${item.id}`,
            title: info.title || "Untitled",
            author: info.authors ? info.authors.join(", ") : "Unknown Author",
            cover:
              cover ||
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
            description:
              info.description || "No description provided from Google Books.",
            category: normalizeCategory(info.categories?.[0]),
            tags: info.categories ? info.categories.slice(0, 3) : ["Novel"],
            rating: info.averageRating || 4.8,
            chapters: info.pageCount || 250,
            views: `${Math.floor(Math.random() * 50) + 10}K`,
          };
        });
      }
    }
  } catch (err) {
    console.warn("Google Books request error:", err.message);
  }

  // 2. Fallback to Open Library
  try {
    const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      cleanQuery
    )}&limit=6`;

    const olRes = await fetch(olUrl, {
      headers: { "User-Agent": "NovelandApp/1.0 (contact@noveland.io)" },
    });

    if (olRes.ok) {
      const olData = await olRes.json();
      if (olData.docs && olData.docs.length > 0) {
        return olData.docs
          .filter((doc) => doc.title)
          .slice(0, 6)
          .map((doc) => {
            const cover = doc.cover_i
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
              : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80";

            return {
              source: "Open Library",
              externalId: `ol-${doc.key || doc.cover_i}`,
              title: doc.title,
              author: doc.author_name
                ? doc.author_name.join(", ")
                : "Unknown Author",
              cover,
              description: `Published in ${doc.first_publish_year || "recent years"}. Explore community discussions, chapter theories, and reviews for ${doc.title} on Noveland.`,
              category: "Fantasy",
              tags: ["Book", "Open Library"],
              rating: 4.7,
              chapters: doc.number_of_pages_median || 320,
              views: "25K",
            };
          });
      }
    }
  } catch (err) {
    console.error("Open Library fallback error:", err.message);
  }

  return [];
};

/**
 * Unified search across RanobeDB, Google Books, and Open Library
 */
export const searchBooksService = async (query, source = "all") => {
  if (!query || !query.trim()) return [];

  if (source === "ranobedb") {
    return await searchRanobeDb(query);
  }

  if (source === "google") {
    return await searchGoogleAndOpenLibrary(query);
  }

  // If source === "all", run both in parallel
  const [ranobeResults, googleResults] = await Promise.all([
    searchRanobeDb(query).catch(() => []),
    searchGoogleAndOpenLibrary(query).catch(() => []),
  ]);

  // Interleave or combine results with RanobeDB light novels first
  return [...ranobeResults, ...googleResults];
};

function normalizeCategory(cat) {
  if (!cat) return "Fantasy";
  const lower = cat.toLowerCase();
  if (lower.includes("sci") || lower.includes("science")) return "Sci-Fi";
  if (lower.includes("action") || lower.includes("adventure")) return "Action";
  if (lower.includes("romance")) return "Romance";
  if (lower.includes("cultivation") || lower.includes("wuxia")) return "Cultivation";
  if (lower.includes("fantasy") || lower.includes("magic") || lower.includes("isekai"))
    return "Fantasy";
  return "Fantasy";
}
