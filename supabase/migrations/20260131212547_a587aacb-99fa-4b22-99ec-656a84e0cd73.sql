-- Enable PostGIS extension for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum types
CREATE TYPE public.route_difficulty AS ENUM ('easy', 'moderate', 'hard', 'expert');
CREATE TYPE public.terrain_type AS ENUM ('paved', 'mixed', 'off-road');
CREATE TYPE public.vote_type AS ENUM ('up', 'down');
CREATE TYPE public.leaderboard_period AS ENUM ('weekly', 'monthly', 'all_time');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    city TEXT DEFAULT 'Dubai',
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_distance_km NUMERIC(10, 2) DEFAULT 0,
    routes_created INTEGER DEFAULT 0,
    routes_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create routes table
CREATE TABLE public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    difficulty route_difficulty DEFAULT 'moderate',
    terrain terrain_type DEFAULT 'paved',
    start_point GEOGRAPHY(POINT, 4326),
    end_point GEOGRAPHY(POINT, 4326),
    waypoints JSONB DEFAULT '[]',
    distance_km NUMERIC(10, 2) DEFAULT 0,
    estimated_time_mins INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    uses_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create route_waypoints table for detailed path
CREATE TABLE public.route_waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE NOT NULL,
    sequence INTEGER NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    elevation NUMERIC(8, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create route_votes table
CREATE TABLE public.route_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE NOT NULL,
    vote_type vote_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, route_id)
);

-- Create route_comments table
CREATE TABLE public.route_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create route_completions table
CREATE TABLE public.route_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    time_taken_mins INTEGER,
    points_earned INTEGER DEFAULT 0
);

-- Create achievements table
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points_value INTEGER DEFAULT 0,
    criteria JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- Create leaderboard_entries table
CREATE TABLE public.leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    period leaderboard_period NOT NULL,
    period_start DATE NOT NULL,
    points INTEGER DEFAULT 0,
    rank INTEGER,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, period, period_start)
);

-- Create indexes for performance
CREATE INDEX idx_routes_user_id ON public.routes(user_id);
CREATE INDEX idx_routes_created_at ON public.routes(created_at DESC);
CREATE INDEX idx_routes_likes_count ON public.routes(likes_count DESC);
CREATE INDEX idx_route_waypoints_route_id ON public.route_waypoints(route_id);
CREATE INDEX idx_route_votes_route_id ON public.route_votes(route_id);
CREATE INDEX idx_route_comments_route_id ON public.route_comments(route_id);
CREATE INDEX idx_route_completions_user_id ON public.route_completions(user_id);
CREATE INDEX idx_leaderboard_entries_period ON public.leaderboard_entries(period, period_start);
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for routes
CREATE POLICY "Public routes are viewable by everyone"
ON public.routes FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create routes"
ON public.routes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routes"
ON public.routes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routes"
ON public.routes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for route_waypoints
CREATE POLICY "Route waypoints viewable if route is viewable"
ON public.route_waypoints FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.routes 
        WHERE routes.id = route_waypoints.route_id 
        AND (routes.is_public = true OR routes.user_id = auth.uid())
    )
);

CREATE POLICY "Route owner can insert waypoints"
ON public.route_waypoints FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.routes 
        WHERE routes.id = route_waypoints.route_id 
        AND routes.user_id = auth.uid()
    )
);

CREATE POLICY "Route owner can update waypoints"
ON public.route_waypoints FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.routes 
        WHERE routes.id = route_waypoints.route_id 
        AND routes.user_id = auth.uid()
    )
);

CREATE POLICY "Route owner can delete waypoints"
ON public.route_waypoints FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.routes 
        WHERE routes.id = route_waypoints.route_id 
        AND routes.user_id = auth.uid()
    )
);

-- RLS Policies for route_votes
CREATE POLICY "Votes are viewable by everyone"
ON public.route_votes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can vote"
ON public.route_votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
ON public.route_votes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
ON public.route_votes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for route_comments
CREATE POLICY "Comments are viewable by everyone"
ON public.route_comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can comment"
ON public.route_comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.route_comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.route_comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for route_completions
CREATE POLICY "Completions are viewable by everyone"
ON public.route_completions FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can log completions"
ON public.route_completions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Achievements are viewable by everyone"
ON public.achievements FOR SELECT
USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "User achievements are viewable by everyone"
ON public.user_achievements FOR SELECT
USING (true);

CREATE POLICY "System can grant achievements"
ON public.user_achievements FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for leaderboard_entries
CREATE POLICY "Leaderboard is viewable by everyone"
ON public.leaderboard_entries FOR SELECT
USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
BEFORE UPDATE ON public.routes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_route_comments_updated_at
BEFORE UPDATE ON public.route_comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leaderboard_entries_updated_at
BEFORE UPDATE ON public.leaderboard_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update route likes count
CREATE OR REPLACE FUNCTION public.update_route_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.routes 
        SET likes_count = likes_count + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
        WHERE id = NEW.route_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.routes 
        SET likes_count = likes_count - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
        WHERE id = OLD.route_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE public.routes 
        SET likes_count = likes_count 
            - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
            + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
        WHERE id = NEW.route_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_route_likes_count
AFTER INSERT OR UPDATE OR DELETE ON public.route_votes
FOR EACH ROW EXECUTE FUNCTION public.update_route_likes_count();

-- Function to update route uses count
CREATE OR REPLACE FUNCTION public.update_route_uses_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.routes 
    SET uses_count = uses_count + 1
    WHERE id = NEW.route_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_route_uses_count
AFTER INSERT ON public.route_completions
FOR EACH ROW EXECUTE FUNCTION public.update_route_uses_count();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 4)
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, points_value, criteria) VALUES
('Explorer', 'Complete 10 different routes', 'compass', 100, '{"type": "completions", "count": 10}'),
('Cartographer', 'Create 5 routes', 'map', 150, '{"type": "routes_created", "count": 5}'),
('Popular', 'Get 50 total likes on your routes', 'heart', 200, '{"type": "total_likes", "count": 50}'),
('Trailblazer', 'Be the first to map a new area', 'flag', 250, '{"type": "first_route_area", "count": 1}'),
('Community Helper', 'Leave 20 comments', 'message-circle', 100, '{"type": "comments", "count": 20}'),
('Speed Demon', 'Complete a route in record time', 'zap', 150, '{"type": "record_time", "count": 1}'),
('Distance King', 'Travel 100km total', 'road', 200, '{"type": "total_distance", "km": 100}'),
('Dedicated Rider', 'Complete 50 routes', 'award', 300, '{"type": "completions", "count": 50}')