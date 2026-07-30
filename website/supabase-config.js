// Supabase configuration details
const SUPABASE_URL = "https://lvpamzdexogemggsodqb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2cGFtemRleG9nZW1nZ3NvZHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxODY3MTcsImV4cCI6MjA5OTc2MjcxN30.cKc2kZpE2cQHYz99bwIOrdv4p70-ADaYKx3l6Lgt9K4";

// Initialize Supabase client
(function() {
  try {
    // Wait for the Supabase library to be available
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      window.supabase = client;
      console.log("Supabase client initialized successfully");
    } else {
      console.error("Supabase library not loaded");
      window.supabase = null;
    }
  } catch (e) {
    console.error("Error initializing Supabase:", e);
    window.supabase = null;
  }
})();
