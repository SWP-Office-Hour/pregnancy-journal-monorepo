import { Media } from '../media/entities/media.entity';

export interface Post {
  post_id: string;
  content: string;
  user_id: string;
  created_at: Date | null;
  updated_at: Date | null;
  media: Media[] | null;
  comment: Comment[];
  reaction: Reaction[];
}

export interface Comment {
  comment_id: string;
  content: string;
  created_at: Date | null;
  updated_at: Date | null;
  user: {
    user_id: string;
    name: string;
    avatar: string | null;
  };
}

export interface Reaction {
  reaction_id: string;
  user: {
    user_id: string;
    avatar: string | null;
  };
}
