import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/supabase';

interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  school_organization?: string;
  phone?: string;
  job_position?: string;
  interests: string[];
  resources: string[];
  methodologies: string[];
  subscribe_newsletter?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  confirmationMessage: { type: 'success' | 'error'; message: string } | null;
  clearConfirmationMessage: () => void;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      setUser(session?.user ?? null);

      // Detect email confirmation
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if this is from email confirmation (user's email_confirmed_at just changed)
        const isEmailConfirmation = session.user.email_confirmed_at &&
                                      !user && // No previous user state
                                      window.location.hash.includes('type=signup'); // URL contains confirmation params

        if (isEmailConfirmation) {
          console.log('Email confirmation detected!');
          console.log('User metadata:', session.user.user_metadata);

          // Try to fetch or create profile from user_metadata
          try {
            const { data: existingProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (existingProfile) {
              // Profile exists
              console.log('Profile already exists:', existingProfile);
              setProfile(existingProfile);
              setConfirmationMessage({
                type: 'success',
                message: `Welcome, ${existingProfile.full_name?.split(' ')[0] || 'there'}! Your email is confirmed. You can now book amazing science shows!`
              });
            } else {
              // Profile doesn't exist - create it from user_metadata
              console.log('Creating profile from user_metadata...');
              const metadata = session.user.user_metadata;

              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  full_name: metadata?.full_name || '',
                  school_organization: metadata?.school_organization || '',
                  phone: metadata?.phone || '',
                  job_position: metadata?.job_position || '',
                  subscribe_newsletter: metadata?.subscribe_newsletter || false,
                })
                .select()
                .single();

              if (createError) {
                console.error('Error creating profile:', createError);
                setConfirmationMessage({
                  type: 'success',
                  message: 'Email Confirmed! Your account is now active.'
                });
              } else {
                console.log('Profile created successfully:', newProfile);
                setProfile(newProfile);
                setConfirmationMessage({
                  type: 'success',
                  message: `Welcome, ${metadata?.full_name?.split(' ')[0] || 'there'}! Your email is confirmed. You can now book amazing science shows!`
                });
              }
            }
          } catch (error) {
            console.error('Error during profile creation:', error);
            setConfirmationMessage({
              type: 'success',
              message: 'Email Confirmed! Your account is now active.'
            });
          }

          // Clear URL hash to clean up
          setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
          }, 100);
        }

        // Fetch profile for any sign in
        fetchProfile(session.user.id);
      } else if (!session) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      // 1. Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            school_organization: data.school_organization,
            phone: data.phone,
            job_position: data.job_position,
            subscribe_newsletter: data.subscribe_newsletter,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      console.log('Auth user created:', authData.user.id);
      console.log('Session exists:', !!authData.session);
      console.log('Email confirmation required:', !authData.session);
      console.log('User metadata saved:', authData.user.user_metadata);

      // Check if email confirmation is required
      // If no session, user needs to confirm email before we can create profile
      if (!authData.session) {
        console.log('Email confirmation required - profile will be created after confirmation');
        // User metadata is saved, profile will be created after email confirmation
        return; // Exit early - user needs to confirm email
      }

      // 2. User is confirmed (session exists), create profile
      console.log('Creating profile for confirmed user...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          school_organization: data.school_organization,
          phone: data.phone,
          job_position: data.job_position,
          subscribe_newsletter: data.subscribe_newsletter,
        });

      // If profile already exists (check multiple error codes for unique constraint)
      if (profileError) {
        console.log('Profile insert error detected:', profileError);
        console.log('Error code:', profileError.code);
        console.log('Error details:', profileError.details);
        console.log('Error message:', profileError.message);

        // Check for unique constraint violation (code 23505 or message contains "duplicate" or "already exists")
        const isDuplicateError =
          profileError.code === '23505' ||
          profileError.code === 'PGRST116' ||
          (profileError.message && (
            profileError.message.includes('duplicate') ||
            profileError.message.includes('already exists') ||
            profileError.message.includes('unique constraint')
          ));

        if (isDuplicateError) {
          console.log('Profile already exists, updating instead...');
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              email: data.email,
              full_name: data.full_name,
              school_organization: data.school_organization,
              phone: data.phone,
              job_position: data.job_position,
              subscribe_newsletter: data.subscribe_newsletter,
            })
            .eq('id', authData.user.id);

          if (updateError) {
            console.error('Profile update error:', updateError);
            throw updateError;
          }
        } else {
          console.error('Profile creation error (not duplicate):', profileError);
          throw profileError;
        }
      }

      // 3. Save preferences - only if user is confirmed (session exists)
      if (authData.session) {
        console.log('Saving user preferences...');
        // Delete existing ones first to avoid conflicts
        await supabase
          .from('user_preferences')
          .delete()
          .eq('user_id', authData.user.id);

        const preferences = [
          ...data.interests.map(i => ({
            user_id: authData.user!.id,
            interest_type: 'science_topic' as const,
            interest_value: i,
          })),
          ...data.resources.map(r => ({
            user_id: authData.user!.id,
            interest_type: 'resource_type' as const,
            interest_value: r,
          })),
          ...data.methodologies.map(m => ({
            user_id: authData.user!.id,
            interest_type: 'methodology' as const,
            interest_value: m,
          })),
        ];

        if (preferences.length > 0) {
          const { error: prefsError } = await supabase
            .from('user_preferences')
            .insert(preferences);

          if (prefsError) {
            console.error('Preferences save error:', prefsError);
            throw prefsError;
          }
        }

        // Fetch the newly created profile
        await fetchProfile(authData.user.id);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Update profiles table
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      // Also update user_metadata to keep in sync
      const metadataUpdate: any = {};
      if (data.full_name !== undefined) metadataUpdate.full_name = data.full_name;
      if (data.school_organization !== undefined) metadataUpdate.school_organization = data.school_organization;
      if (data.phone !== undefined) metadataUpdate.phone = data.phone;
      if (data.job_position !== undefined) metadataUpdate.job_position = data.job_position;

      if (Object.keys(metadataUpdate).length > 0) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: metadataUpdate,
        });
        if (metadataError) console.error('Error updating user metadata:', metadataError);
      }

      // Refresh profile
      await fetchProfile(user.id);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const clearConfirmationMessage = () => {
    setConfirmationMessage(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        confirmationMessage,
        clearConfirmationMessage,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
