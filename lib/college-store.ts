// Simple in-memory store for college URL
// Pre-configured for Rathinam College of Arts and Science
class CollegeStore {
  private collegeUrl: string | null = "https://rathinamcollege.ac.in/";
  private cacheVersion: number = 0;

  setCollegeUrl(url: string) {
    this.collegeUrl = url;
    this.cacheVersion++; // Increment cache version to invalidate old cache
    console.log("College URL set to:", url);
  }

  getCollegeUrl(): string | null {
    return this.collegeUrl;
  }

  getCacheVersion(): number {
    return this.cacheVersion;
  }

  clearCollegeUrl() {
    this.collegeUrl = null;
    this.cacheVersion++;
  }
}

// Export a singleton instance
export const collegeStore = new CollegeStore();
