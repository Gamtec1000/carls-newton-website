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
  showWelcomeModal: boolean;
  clearConfirmationMessage: () => void;
  closeWelcomeModal: () => void;
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
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check for email confirmation errors in URL hash
    const checkForErrors = () => {
      const hash = window.location.hash;
      if (hash.includes('error=')) {
        const urlParams = new URLSearchParams(hash.substring(1));
        const error = urlParams.get('error');
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');

        console.log('Email confirmation error detected:', { error, errorCode, errorDescription });

        let errorMessage = '❌ Email confirmation failed';

        if (errorCode === 'otp_expired' || errorDescription?.includes('expired')) {
          errorMessage = '❌ Email Confirmation Link Expired\n\nYour confirmation link has expired. Please sign in and request a new confirmation email.\n\nNeed help? Contact: hello@carlsnewton.com';
        } else if (error === 'access_denied') {
          errorMessage = '❌ Email Confirmation Failed\n\nThe confirmation link is invalid or has already been used.\n\nPlease try signing in or contact: hello@carlsnewton.com';
        } else {
          errorMessage = `❌ Email Confirmation Failed\n\n${errorDescription?.replace(/\+/g, ' ') || 'Please try again or contact support.'}\n\nContact: hello@carlsnewton.com`;
        }

        setConfirmationMessage({
          type: 'error',
          message: errorMessage
        });

        // Clear URL hash
        setTimeout(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        }, 100);
      }
    };

    checkForErrors();

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
        // Check if this is from email confirmation
        const isEmailConfirmation = (
          session.user.email_confirmed_at &&
          !user && // No previous user state
          (window.location.hash.includes('type=signup') ||
           window.location.hash.includes('access_token'))
        );

        if (isEmailConfirmation) {
          console.log('=== EMAIL CONFIRMATION DETECTED ===');
          console.log('User ID:', session.user.id);
          console.log('User Email:', session.user.email);
          console.log('User metadata:', session.user.user_metadata);
          console.log('===================================');

          // Check if user has been welcomed before
          const hasBeenWelcomed = localStorage.getItem(`welcomed_user_${session.user.id}`);
          const isFirstTimeConfirmation = !hasBeenWelcomed;

          // Profile is automatically created by database trigger
          // Just fetch it and handle preferences/welcome modal
          try {
            console.log('=== FETCHING PROFILE (created by trigger) ===');
            const { data: existingProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (fetchError) {
              console.error('Error fetching profile:', fetchError);
              console.error('Profile should have been auto-created by database trigger');
            } else {
              console.log('✅ Profile loaded:', existingProfile);
              setProfile(existingProfile);
            }

            const metadata = session.user.user_metadata;
            const firstName = (existingProfile?.full_name || metadata?.full_name || '').split(' ')[0] || 'there';
            console.log('=================================');

            // Save user preferences from metadata
            const interests = metadata?.interests || [];
            const resources = metadata?.resources || [];
            const methodologies = metadata?.methodologies || [];

            if (interests.length > 0 || resources.length > 0 || methodologies.length > 0) {
              console.log('Saving user preferences from metadata...');

              // Delete existing preferences first to avoid conflicts
              await supabase
                .from('user_preferences')
                .delete()
                .eq('user_id', session.user.id);

              const preferences = [
                ...interests.map((i: string) => ({
                  user_id: session.user.id,
                  interest_type: 'science_topic' as const,
                  interest_value: i,
                })),
                ...resources.map((r: string) => ({
                  user_id: session.user.id,
                  interest_type: 'resource_type' as const,
                  interest_value: r,
                })),
                ...methodologies.map((m: string) => ({
                  user_id: session.user.id,
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
                } else {
                  console.log('Preferences saved successfully:', preferences.length);
                }
              }
            }

            // Show toast notification
            setConfirmationMessage({
              type: 'success',
              message: `✅ Email Confirmed Successfully!\nWelcome to Carls Newton, ${firstName}! 🚀`
            });

            // Show welcome modal only for first-time confirmations
            if (isFirstTimeConfirmation) {
              console.log('First-time confirmation - showing welcome modal');
              // Delay modal to show after toast
              setTimeout(() => {
                setShowWelcomeModal(true);
                // Mark user as welcomed
                localStorage.setItem(`welcomed_user_${session.user.id}`, 'true');
              }, 1000);
            } else {
              console.log('User already welcomed - skipping modal');
            }
          } catch (error) {
            console.error('Error during profile creation:', error);
            setConfirmationMessage({
              type: 'success',
              message: '✅ Email Confirmed Successfully!\nYour account is now active.'
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
      console.log('=== FETCHING PROFILE ===');
      console.log('User ID:', userId);
      console.log('User ID type:', typeof userId);
      console.log('User ID length:', userId?.length);

      // Use maybeSingle() instead of single() to handle edge cases better
      // maybeSingle() returns null if no rows, data if one row, error if multiple rows
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Query completed');
      console.log('Data received:', data);
      console.log('Error received:', error);

      if (error) {
        console.error('❌ Error fetching profile:');
        console.error('  Error code:', error.code);
        console.error('  Error message:', error.message);
        console.error('  Error details:', error.details);
        console.error('  Error hint:', error.hint);
        console.error('  Full error:', JSON.stringify(error, null, 2));

        // If error is PGRST116 (multiple rows), log warning about duplicates
        if (error.code === 'PGRST116') {
          console.error('⚠️ DUPLICATE PROFILES DETECTED!');
          console.error('⚠️ Multiple profile records exist for user:', userId);
          console.error('⚠️ This should not happen - run SQL to find and remove duplicates');
        }

        throw error;
      }

      if (!data) {
        console.warn('⚠️ No profile found for user:', userId);
        console.warn('⚠️ Profile should have been created by database trigger');
        console.warn('⚠️ User will need to complete their profile');
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('✅ Profile fetched successfully!');
      console.log('  Profile ID:', data.id);
      console.log('  Profile email:', data.email);
      console.log('  Profile full_name:', data.full_name);
      console.log('  Profile phone:', data.phone);
      console.log('  Profile school_organization:', data.school_organization);
      console.log('  Profile job_position:', data.job_position);
      console.log('  Profile created_at:', data.created_at);
      console.log('  Profile updated_at:', data.updated_at);
      console.log('========================');

      setProfile(data);
    } catch (error) {
      console.error('❌ CRITICAL: Error fetching profile:', error);
      console.error('Setting profile to null');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      // 1. Create auth user with metadata (including preferences for email confirmation flow)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
          data: {
            full_name: data.full_name,
            school_organization: data.school_organization,
            phone: data.phone,
            job_position: data.job_position,
            subscribe_newsletter: data.subscribe_newsletter,
            // Store preferences in metadata so they're available after email confirmation
            interests: data.interests,
            resources: data.resources,
            methodologies: data.methodologies,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      console.log('=== REGISTRATION DEBUG ===');
      console.log('Auth user created:', authData.user.id);
      console.log('Session exists:', !!authData.session);
      console.log('Email confirmation required:', !authData.session);
      console.log('User metadata saved:', authData.user.user_metadata);
      console.log('Metadata full_name:', authData.user.user_metadata?.full_name);
      console.log('Metadata phone:', authData.user.user_metadata?.phone);
      console.log('Metadata school_organization:', authData.user.user_metadata?.school_organization);
      console.log('Metadata job_position:', authData.user.user_metadata?.job_position);
      console.log('==========================');

      // Check if email confirmation is required
      // If no session, user needs to confirm email before we can create profile
      if (!authData.session) {
        console.log('Email confirmation required - profile will be created after confirmation');

        // Send confirmation email via Resend API
        try {
          // Use Supabase's resend method to trigger email confirmation
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: data.email,
            options: {
              emailRedirectTo: `${window.location.origin}`,
            },
          });

          if (resendError) {
            console.error('Error triggering confirmation email:', resendError);
            // Continue anyway - user can manually request resend later
          } else {
            console.log('Confirmation email triggered successfully');
          }
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Continue anyway - the important part is the user was created
        }

        // User metadata is saved
        // Profile will be automatically created by database trigger
        return; // Exit early - user needs to confirm email
      }

      // 2. User is confirmed (session exists)
      // Profile is automatically created by database trigger
      // Just save preferences and fetch the profile
      console.log('User confirmed, profile auto-created by database trigger');

      // 3. Save preferences if user is confirmed (session exists)
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

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        confirmationMessage,
        showWelcomeModal,
        clearConfirmationMessage,
        closeWelcomeModal,
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
