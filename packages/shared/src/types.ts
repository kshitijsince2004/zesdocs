// Shared TypeScript types for Zesdocs

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Link {
  id: string;
  url: string;
  title?: string;
  description?: string;
  ownerId: string;
  status: 'pending_index' | 'ready' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  metadata?: LinkMetadata;
}

export interface LinkMetadata {
  contentType?: string;
  tags?: string[];
  imageUrl?: string;
  siteName?: string;
  canonicalUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}
