"use client";

import { useState } from "react";
import { Github, MapPin, Users, Book, Link as LinkIcon, Twitter, Building, Calendar, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubProfile {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  blog: string;
  twitter_username: string;
  company: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  const fetchProfile = async () => {
    if (!username) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">GitHub Profile Viewer</h1>
          <p className="text-muted-foreground">Enter a GitHub username to view their profile</p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProfile()}
          />
          <Button onClick={fetchProfile} disabled={loading}>
            <Github className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        {error && (
          <div className="text-destructive text-center p-4 bg-destructive/10 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : (
          profile && (
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    <a
                      href={profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      @{profile.login}
                    </a>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-gray-700 mb-4">{profile.bio}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.company && (
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{profile.company}</span>
                      </div>
                    )}
                    
                    {profile.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    {profile.blog && (
                      <div className="flex items-center text-gray-600">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        <a
                          href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gray-900"
                        >
                          {profile.blog}
                        </a>
                      </div>
                    )}
                    
                    {profile.twitter_username && (
                      <div className="flex items-center text-gray-600">
                        <Twitter className="w-4 h-4 mr-2" />
                        <a
                          href={`https://twitter.com/${profile.twitter_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gray-900"
                        >
                          @{profile.twitter_username}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{profile.followers}</span>
                      <span className="ml-1 text-gray-500">followers</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{profile.following}</span>
                      <span className="ml-1 text-gray-500">following</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{profile.public_repos}</span>
                      <span className="ml-1 text-gray-500">repositories</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {formatDate(profile.created_at)}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}