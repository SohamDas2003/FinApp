import React, { useState, useEffect } from "react";
import { FaNewspaper, FaExternalLinkAlt, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import "../styles/App.css";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Using newsdata.io API
        const response = await fetch(
          "https://newsdata.io/api/1/news?apikey=pub_82073e87a6d57560e618679ec02d7e68b2de1&q=financial%20news&country=in&category=business,politics,world"
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        
        const data = await response.json();
        if (data.status === "success" && data.results && data.results.length > 0) {
          // Limit to 5 articles to fit in sidebar
          setNews(data.results.slice(0, 5));
        } else {
          throw new Error("No news data available");
        }
        setLoading(false);
      } catch (err) {
        console.error("News fetch error:", err);
        setError(err.message);
        setLoading(false);
        // Fallback data in case API fails
        setNews([
          {
            title: "Global volatility, not government, may spark a PSU renaissance",
            description: "While government persuasion may not attract investors to PSUs, compelling valuations and strong growth prospects amidst global uncertainties might do the trick.",
            pubDate: "2025-04-21 00:10:04",
            source_name: "Mint",
            link: "https://www.livemint.com/market/psu-stocks-investors-psus-dividend-global-volatility-11745123798984.html"
          },
          {
            title: "Sentiment for deals and IPOs may turnaround post Q4 results",
            description: "Neha Agarwal, MD & head of Equity Capital Markets at JM Financial, expects Trump's tariff talks to ease trade tension and lift investor confidence if they move toward resolution.",
            pubDate: "2025-04-21 00:00:04",
            source_name: "Mint",
            link: "https://www.livemint.com/market/deals-ipos-capital-markets-q4-diis-deal-pricing-fiis-qip-tariff-investors-fundraising-jm-financial-11745127528558.html"
          },
          {
            title: "Markets Rally as Fed Signals Rate Cut",
            description: "Stocks surged today as Federal Reserve signals potential interest rate cuts in the coming months.",
            pubDate: "2023-04-21 14:30:00",
            source_name: "Financial Times",
            link: "https://ft.com"
          },
          {
            title: "Tech Sector Leads Market Gains",
            description: "Technology stocks continue their upward trend as earnings reports exceed expectations.",
            pubDate: "2023-04-21 10:15:00",
            source_name: "CNBC",
            link: "https://cnbc.com"
          },
          {
            title: "Oil Prices Stabilize After Recent Volatility",
            description: "Crude oil prices have stabilized following weeks of fluctuation due to supply chain concerns.",
            pubDate: "2023-04-20 16:45:00",
            source_name: "Bloomberg",
            link: "https://bloomberg.com"
          }
        ]);
      }
    };

    // Fetch daily finance quote
    const fetchQuote = () => {
      // Array of finance-related quotes
      const financeQuotes = [
        {
          text: "The stock market is a device for transferring money from the impatient to the patient.",
          author: "Warren Buffett"
        },
        {
          text: "In investing, what is comfortable is rarely profitable.",
          author: "Robert Arnott"
        },
        {
          text: "The four most dangerous words in investing are: 'this time it's different.'",
          author: "Sir John Templeton"
        },
        {
          text: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
          author: "Albert Einstein"
        },
        {
          text: "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
          author: "Robert Kiyosaki"
        },
        {
          text: "An investment in knowledge pays the best interest.",
          author: "Benjamin Franklin"
        },
        {
          text: "The individual investor should act consistently as an investor and not as a speculator.",
          author: "Ben Graham"
        },
        {
          text: "The best investment you can make is in yourself.",
          author: "Warren Buffett"
        },
        {
          text: "Do not save what is left after spending, but spend what is left after saving.",
          author: "Warren Buffett"
        },
        {
          text: "Money is a terrible master but an excellent servant.",
          author: "P.T. Barnum"
        },
        {
          text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest.",
          author: "Dave Ramsey"
        },
        {
          text: "Never depend on a single income. Make investment to create a second source.",
          author: "Warren Buffett"
        }
      ];

      // Get a random quote
      const randomIndex = Math.floor(Math.random() * financeQuotes.length);
      setQuote(financeQuotes[randomIndex]);
    };

    fetchNews();
    fetchQuote();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // Handle standard date string
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="news-container">
        <h3 className="news-header">
          <FaNewspaper style={{ marginRight: "10px" }} /> Financial News
        </h3>
        <div className="loading">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="news-container">
      {/* Financial News Section */}
      <h3 className="news-header">
        <FaNewspaper style={{ marginRight: "10px" }} /> Financial News
      </h3>
      <div className="news-list">
        {news.map((item, index) => (
          <div className="news-item" key={index}>
            <div className="news-title">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.title}
                <FaExternalLinkAlt style={{ marginLeft: "5px", fontSize: "0.7rem" }} />
              </a>
            </div>
            <div className="news-meta">
              <span className="news-source">{item.source_name}</span>
              <span className="news-date">{formatDate(item.pubDate)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Finance Quote Section */}
      <div className="quote-container">
        <h3 className="quote-header">
          <FaQuoteLeft style={{ marginRight: "10px" }} /> Daily Finance Quote
        </h3>
        <div className="quote-content">
          <p className="quote-text">
            <FaQuoteLeft className="quote-icon-left" /> 
            {quote.text} 
            <FaQuoteRight className="quote-icon-right" />
          </p>
          <p className="quote-author">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
};

export default News; 