import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, X, AlertCircle, CheckCircle, MapPin, Lock, Edit } from 'lucide-react';
import type { CalendarDay, Booking } from '../types/booking';
import {
  generateTimeSlots,
  hasHalfDayBooking,
  getBookingsForDate,
  validateBookingForm,
} from '../utils/bookingValidation';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../styles/phone-input.css';
import { useAuth } from '../contexts/AuthContext';

interface EnhancedBookingCalendarProps {
  onAuthRequired?: () => void;
  onProfileSettingsClick?: () => void;
}

const EnhancedBookingCalendar: React.FC<EnhancedBookingCalendarProps> = ({ onAuthRequired, onProfileSettingsClick }) => {
  const { user, profile } = useAuth();

  // Component mount logging
  useEffect(() => {
    console.log('🎯 ===== ENHANCED BOOKING CALENDAR MOUNTED =====');
    console.log('🎯 Component initialized');
    console.log('🎯 User from useAuth:', user);
    console.log('🎯 Profile from useAuth:', profile);
    console.log('🎯 ==========================================');
  }, []);

  // Track user and profile changes
  useEffect(() => {
    console.log('👤 ===== USER/PROFILE STATE CHANGED =====');
    console.log('👤 User exists:', !!user);
    console.log('👤 User email:', user?.email);
    console.log('👤 User ID:', user?.id);
    console.log('📊 Profile exists:', !!profile);
    console.log('📊 Profile object:', profile);
    if (profile) {
      console.log('📊 Profile.full_name:', profile.full_name);
      console.log('📊 Profile.email:', profile.email);
      console.log('📊 Profile.phone:', profile.phone);
      console.log('📊 Profile.school_organization:', profile.school_organization);
      console.log('📊 Profile.job_position:', profile.job_position);
    }
    console.log('👤 ======================================');
  }, [user, profile]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<'preschool' | 'classic' | 'halfday'>('classic');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSuccessView, setShowSuccessView] = useState(false); // Controls showing success instead of form
  const [bookingDetails, setBookingDetails] = useState<{ bookingId: string; packageType: string; date: string; organizationName: string; email: string } | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isProfileDataLocked, setIsProfileDataLocked] = useState(false);

  // Persistent customer data across bookings
  const [persistentCustomerData, setPersistentCustomerData] = useState({
    title: 'Mr' as 'Mr' | 'Ms' | 'Dr' | 'Mrs' | 'Prof',
    name: '',
    jobPosition: '',
    organizationName: '',
    email: '',
    phone: '',
  });

  // Form data with location fields
  const [formData, setFormData] = useState({
    title: 'Mr' as 'Mr' | 'Ms' | 'Dr' | 'Mrs' | 'Prof',
    name: '',
    jobPosition: '',
    organizationName: '',
    email: '',
    phone: '',
    address: '',
    addressDetails: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null,
    specialRequests: '',
  });

  // Track form data changes
  useEffect(() => {
    console.log('📝 ===== FORM DATA CHANGED =====');
    console.log('📝 Form name:', formData.name);
    console.log('📝 Form email:', formData.email);
    console.log('📝 Form phone:', formData.phone);
    console.log('📝 Form organizationName:', formData.organizationName);
    console.log('📝 Form jobPosition:', formData.jobPosition);
    console.log('📝 isProfileDataLocked:', isProfileDataLocked);
    console.log('📝 ==============================');
  }, [formData, isProfileDataLocked]);

  // Google Maps refs
  const mapRef = useRef<HTMLDivElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<any>(null); // AdvancedMarkerElement type

  // Fetch bookings on component mount and when month changes
  useEffect(() => {
    fetchBookings();
  }, [currentDate]);

  // Auto-fill form with profile data when profile loads or modal opens
  useEffect(() => {
    console.log('🔍 ===== AUTO-FILL EFFECT TRIGGERED =====');
    console.log('🔍 showBookingModal:', showBookingModal);
    console.log('🔍 user:', user);
    console.log('🔍 profile:', profile);

    if (!showBookingModal) {
      console.log('🔍 Modal not open - skipping auto-fill');
      console.log('🔍 ======================================');
      return; // Only auto-fill when modal is open
    }

    console.log('🔍 ===== BOOKING FORM AUTO-FILL CHECK =====');
    console.log('📋 Modal open:', showBookingModal);
    console.log('👤 User exists:', !!user);
    console.log('👤 User object type:', typeof user);
    console.log('👤 User email:', user?.email);
    console.log('👤 User ID:', user?.id);
    console.log('📊 Profile exists:', !!profile);
    console.log('📊 Profile object type:', typeof profile);
    console.log('📊 Profile data (stringified):', JSON.stringify(profile, null, 2));

    if (profile && user) {
      console.log('✅ BOTH profile AND user exist - proceeding with auto-fill');
      console.log('✅ Extracting profile fields:');
      console.log('  - full_name:', profile.full_name);
      console.log('  - email:', profile.email);
      console.log('  - phone:', profile.phone);
      console.log('  - school_organization:', profile.school_organization);
      console.log('  - job_position:', profile.job_position);

      console.log('🔄 Calling setFormData...');
      const newFormData = {
        title: 'Mr' as const, // Default title
        name: profile.full_name || '',
        jobPosition: profile.job_position || '',
        organizationName: profile.school_organization || '',
        email: profile.email || '',
        phone: profile.phone || '',
      };
      console.log('🔄 New form data to set:', newFormData);

      setFormData(prev => {
        console.log('🔄 Previous form data:', prev);
        const updated = {
          ...prev,
          ...newFormData,
        };
        console.log('🔄 Updated form data:', updated);
        return updated;
      });

      setIsProfileDataLocked(true);
      console.log('✅ Form auto-filled with profile data');
      console.log('✅ Profile data locked: true');
    } else if (!profile && user) {
      console.log('⚠️ User logged in but profile is NULL or undefined');
      console.log('⚠️ User ID:', user.id);
      console.log('⚠️ User email:', user.email);
      console.log('⚠️ This means AuthContext did not load the profile');
      console.log('⚠️ Check AuthContext logs for profile fetch errors');
    } else if (!user) {
      console.log('❌ No user logged in');
      console.log('❌ Using persistent customer data');
      setIsProfileDataLocked(false);
    } else {
      console.log('⚠️ Unexpected state:');
      console.log('⚠️ user:', user);
      console.log('⚠️ profile:', profile);
    }
    console.log('🔍 ===== END AUTO-FILL CHECK =====');
  }, [showBookingModal, profile, user]); // Re-run when modal opens or profile loads

  // Load Google Maps script
  const loadGoogleMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.maps && window.google.maps.Map) {
        resolve();
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

      if (!apiKey) {
        reject(new Error('Google Maps API key is missing'));
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        // Script exists, wait for it to load
        existingScript.addEventListener('load', () => {
          setTimeout(() => {
            if (window.google && window.google.maps && window.google.maps.Map) {
              resolve();
            } else {
              reject(new Error('Google Maps failed to initialize'));
            }
          }, 100);
        });
        return;
      }

      // Create script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Wait a bit more to ensure google.maps is fully available
        setTimeout(() => {
          if (window.google && window.google.maps && window.google.maps.Map) {
            resolve();
          } else {
            reject(new Error('Google Maps failed to initialize'));
          }
        }, 100);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Maps script. Check your API key and network connection.'));
      };

      document.head.appendChild(script);
    });
  };

  // Cleanup function for map and autocomplete
  const cleanupMap = () => {
    console.log('Cleaning up map and autocomplete instances');

    // Clear autocomplete listeners
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

    // Remove marker
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }

    // Clear map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current = null;
    }
  };

  // Initialize Google Maps and Places Autocomplete
  useEffect(() => {
    if (!showBookingModal) {
      // Clean up when modal closes
      cleanupMap();
      return;
    }

    const initMaps = async () => {
      // Check if refs are available
      if (!addressInputRef.current || !mapRef.current) {
        console.warn('Map or input ref not available yet');
        return;
      }

      setMapLoading(true);
      setMapError(null);

      try {
        // Clean up any existing instances first
        cleanupMap();

        // Small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 50));

        // Wait for Google Maps to load
        await loadGoogleMaps();

        // Load the marker library for AdvancedMarkerElement
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as any;

        // Initialize map - try to get user's current location first
        if (mapRef.current) {
          let center = { lat: 25.2048, lng: 55.2708 }; // Dubai fallback
          let zoom = 11;

          // Try to get user's actual location
          if (navigator.geolocation) {
            try {
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                  resolve,
                  reject,
                  { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
              });

              // Use user's current location
              center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              zoom = 13; // Closer zoom for current location

              console.log('Using user location:', center);
            } catch (geoError) {
              console.log('Geolocation denied or unavailable, using Dubai default');
            }
          }

          // Create new map instance each time
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            mapId: 'BOOKING_MAP', // Required for AdvancedMarkerElement
          });

          console.log('Map initialized successfully');
        }

        // Initialize Places Autocomplete - create new instance each time
        if (addressInputRef.current) {
          autocompleteRef.current = new google.maps.places.Autocomplete(
            addressInputRef.current,
            {
              componentRestrictions: { country: ['ae', 'sa', 'kw', 'qa', 'om', 'bh', 'eg'] },
              fields: ['name', 'formatted_address', 'geometry', 'address_components'],
            }
          );

          autocompleteRef.current.addListener('place_changed', async () => {
            const place = autocompleteRef.current?.getPlace();

            if (!place?.geometry?.location) {
              console.error('No geometry found for place');
              return;
            }

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            // Get the BEST address to save
            // Priority: place.name > formatted_address without plus codes
            let addressToSave = place.name || place.formatted_address || '';

            // If formatted_address contains plus codes (like CG8W+8VV), prefer place.name
            if (place.formatted_address && place.formatted_address.match(/[A-Z0-9]{4}\+[A-Z0-9]{2,3}/)) {
              // Has plus code, use name instead if available
              addressToSave = place.name || place.formatted_address;
              console.log('Plus code detected, using place name:', place.name);
            }

            // Clean up - remove plus codes if they still exist
            addressToSave = addressToSave.replace(/[A-Z0-9]{4}\+[A-Z0-9]{2,3}\s*-?\s*/g, '').trim();

            // Remove leading/trailing dashes and extra spaces
            addressToSave = addressToSave.replace(/^[-\s]+|[-\s]+$/g, '').replace(/\s+/g, ' ');

            console.log('Saving address:', addressToSave);
            console.log('Original formatted_address:', place.formatted_address);
            console.log('Place name:', place.name);

            // Extract city from address components
            let city = '';
            if (place.address_components) {
              const cityComponent = place.address_components.find(
                (component) =>
                  component.types.includes('locality') ||
                  component.types.includes('administrative_area_level_1')
              );
              city = cityComponent?.long_name || '';
            }

            // Update form data with clean address
            setFormData((prev) => ({
              ...prev,
              address: addressToSave,
              city,
              latitude: lat,
              longitude: lng,
            }));

            // Update input to show clean address
            if (addressInputRef.current) {
              addressInputRef.current.value = addressToSave;
            }

            // Update map and marker
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setCenter({ lat, lng });
              mapInstanceRef.current.setZoom(15);

              // Remove old marker if exists
              if (markerRef.current) {
                markerRef.current.map = null;
              }

              // Load marker library and create new AdvancedMarkerElement (not deprecated Marker)
              try {
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as any;

                markerRef.current = new AdvancedMarkerElement({
                  map: mapInstanceRef.current,
                  position: { lat, lng },
                  title: addressToSave,
                });

                console.log('✓ Marker placed at:', addressToSave);
              } catch (markerError) {
                console.error('Error creating marker:', markerError);
              }
            }
          });
        }

        setMapLoading(false);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setMapError(error instanceof Error ? error.message : 'Failed to load map');
        setMapLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMaps();
    }, 100);

    return () => clearTimeout(timer);
  }, [showBookingModal]);

  const fetchBookings = async () => {
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      const response = await fetch(
        `/api/get-bookings?from_date=${startDate}&to_date=${endDate}`
      );

      if (response.ok) {
        const data = await response.json();
        // Validate and sanitize booking data to prevent undefined errors
        const safeBookings = (data.bookings || []).map((booking: any) => ({
          ...booking,
          // Ensure critical fields have fallback values
          email: booking.email || '',
          address: booking.full_address || booking.address || '',
          full_address: booking.full_address || booking.address || '',
          package_type: booking.package_type || 'classic',
          time_slot: booking.time_slot || '09:00 AM',
          status: booking.status || 'pending',
        }));
        setBookings(safeBookings);
        console.log('📅 Fetched bookings:', safeBookings.length);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  // Generate calendar days for a specific month and year
  const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0);

    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = prevMonthLastDay.getDate();

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isSelected: selectedDate?.getTime() === date.getTime(),
        isAvailable: false,
        bookingCount: 0,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const isPastDate = date < today;
      const dateBookings = getBookingsForDate(bookings, dateStr);
      const hasHalfDay = hasHalfDayBooking(bookings, dateStr);

      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        isSelected: selectedDate?.getTime() === date.getTime(),
        isAvailable: !isPastDate && !hasHalfDay,
        bookingCount: dateBookings.length,
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: selectedDate?.getTime() === date.getTime(),
        isAvailable: true,
        bookingCount: 0,
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isAvailable && day.isCurrentMonth) {
      console.log('📅 ===== DATE CLICKED =====');
      console.log('📅 Selected date:', day.date);

      // Check if user is logged in
      if (!user) {
        console.log('❌ User not logged in - showing auth modal');
        // User not logged in - show auth modal
        if (onAuthRequired) {
          onAuthRequired();
        }
        return;
      }

      console.log('👤 User is logged in:', user.email);
      console.log('📊 Profile available:', !!profile);

      setSelectedDate(day.date);
      setShowBookingModal(true); // This will trigger the auto-fill useEffect
      setSelectedTimeSlot(null);
      setError(null);
      setSuccess(false);
      setShowSuccessView(false); // Always show form when opening modal
      setBookingDetails(null);

      // Pre-fill with profile data if available, otherwise use persistent data
      // NOTE: This is now also handled by the useEffect, but we keep it here for immediate feedback
      if (profile) {
        console.log('✅ Pre-filling form with profile data on click');
        setFormData({
          title: 'Mr', // Default title
          name: profile.full_name || '',
          jobPosition: profile.job_position || '',
          organizationName: profile.school_organization || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: '',
          addressDetails: '',
          city: '',
          latitude: null,
          longitude: null,
          specialRequests: '',
        });
        setIsProfileDataLocked(true); // Lock fields when using profile data
      } else {
        console.log('⚠️ No profile available on click - using persistent data');
        console.log('⚠️ useEffect will auto-fill when profile loads');
        // Fallback to persistent customer data
        setFormData({
          ...persistentCustomerData,
          address: '',
          addressDetails: '',
          city: '',
          latitude: null,
          longitude: null,
          specialRequests: '',
        });
        setIsProfileDataLocked(false);
      }

      // Clear the address input field
      if (addressInputRef.current) {
        addressInputRef.current.value = '';
      }

      console.log('📅 ===== END DATE CLICK =====');
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedDate || !selectedTimeSlot) {
      setError('Please select a date and time slot');
      return;
    }

    // Validate form
    const validation = validateBookingForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: selectedTimeSlot,
      packageType: selectedPackage,
    });

    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    setLoading(true);

    try {
      const PACKAGE_PRICES = {
        preschool: 1200,
        classic: 1800,
        halfday: 2500,
      };

      const bookingData = {
        title: formData.title,
        customer_name: formData.name,
        job_position: formData.jobPosition,
        organization_name: formData.organizationName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        address_details: formData.addressDetails,
        city: formData.city,
        latitude: formData.latitude,
        longitude: formData.longitude,
        package_type: selectedPackage,
        date: selectedDate.toISOString().split('T')[0],
        time_slot: selectedTimeSlot,
        price: PACKAGE_PRICES[selectedPackage],
        special_requests: formData.specialRequests,
      };

      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      // Store booking details for WhatsApp link
      const packageNames = {
        preschool: 'Preschool Special',
        classic: 'Classic Show',
        halfday: 'Half-Day Experience'
      };

      setBookingDetails({
        bookingId: result.bookingId,
        packageType: packageNames[selectedPackage],
        date: selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || '',
        organizationName: formData.organizationName,
        email: formData.email
      });

      // Save customer data for next booking
      setPersistentCustomerData({
        title: formData.title,
        name: formData.name,
        jobPosition: formData.jobPosition,
        organizationName: formData.organizationName,
        email: formData.email,
        phone: formData.phone,
      });

      console.log('✅ Booking successful! Booking ID:', result.bookingId);
      console.log('Showing success view...');

      // Show success view instead of form
      setSuccess(true);
      setShowSuccessView(true);

      // Scroll modal to top to show success message
      setTimeout(() => {
        const modalContent = document.querySelector('[data-modal-content]');
        if (modalContent) {
          modalContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);

      // Refresh bookings (with error handling to prevent white screen)
      try {
        await fetchBookings();
        console.log('✅ Bookings refreshed successfully');
      } catch (refreshError) {
        console.error('Warning: Failed to refresh bookings list:', refreshError);
        // Don't show error to user - booking was successful, just refresh failed
      }

      // DO NOT auto-close modal - let user close it manually or book another date
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // Generate calendar days for current month and next month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const currentMonthDays = generateCalendarDays(currentYear, currentMonth);
  const nextMonthDays = generateCalendarDays(nextMonthYear, nextMonth);

  const availableTimeSlots = selectedDate
    ? generateTimeSlots(
        bookings,
        selectedDate.toISOString().split('T')[0],
        selectedPackage,
        formData.email || undefined,
        formData.address || undefined
      )
    : [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
    },
    twoMonthGrid: {
      display: 'grid',
      gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1fr 1fr',
      gap: window.innerWidth < 1024 ? '30px' : '40px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      transition: 'all 0.3s',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    monthTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    navButtons: {
      display: 'flex',
      gap: '12px',
    },
    navButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '10px',
      padding: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,
    legend: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    legendBox: (color: string) => ({
      width: '16px',
      height: '16px',
      borderRadius: '4px',
      background: color,
      border: '1px solid rgba(255, 255, 255, 0.3)',
    }),
    weekDaysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '6px',
      marginBottom: '6px',
    },
    weekDay: {
      color: '#A78BFA',
      fontSize: '13px',
      fontWeight: '600',
      textAlign: 'center' as const,
      padding: '8px 4px',
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '6px',
    },
    dayCell: (day: CalendarDay) => {
      let backgroundColor = 'rgba(255, 255, 255, 0.03)';

      if (day.isSelected) {
        backgroundColor = 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)';
      } else if (day.bookingCount && day.bookingCount > 0) {
        backgroundColor = 'rgba(239, 68, 68, 0.3)'; // Red for booked dates
      } else if (day.isToday) {
        backgroundColor = 'rgba(251, 191, 36, 0.2)';
      } else if (day.isAvailable && day.isCurrentMonth) {
        backgroundColor = 'rgba(34, 197, 94, 0.2)'; // Green for available
      }

      return {
        minHeight: '50px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: day.isAvailable && day.isCurrentMonth ? 'pointer' : 'default',
        transition: 'all 0.3s',
        background: backgroundColor,
        border: day.isToday
          ? '2px solid #FBBF24'
          : '1px solid rgba(255, 255, 255, 0.1)',
        color: !day.isCurrentMonth
          ? 'rgba(255, 255, 255, 0.3)'
          : !day.isAvailable
          ? 'rgba(255, 255, 255, 0.4)'
          : 'white',
        opacity: !day.isAvailable && day.isCurrentMonth ? 0.5 : 1,
        padding: '8px 4px',
      };
    },
    bookingDot: {
      fontSize: '10px',
      color: '#EF4444',
      marginTop: '2px',
    },
    modal: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #312e81 100%)',
      borderRadius: '24px',
      border: '2px solid #A855F7',
      padding: '32px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      position: 'relative' as const,
      boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
    },
    closeButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
    } as React.CSSProperties,
    section: {
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#C4B5FD',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    timeSlotsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '12px',
    },
    timeSlot: (selected: boolean) => ({
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: selected
        ? 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)'
        : 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '14px',
      fontWeight: '500',
    }),
    packageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
    },
    packageCard: (selected: boolean) => ({
      padding: '16px',
      borderRadius: '12px',
      border: selected
        ? '2px solid #06B6D4'
        : '1px solid rgba(255, 255, 255, 0.2)',
      background: selected
        ? 'rgba(6, 182, 212, 0.1)'
        : 'rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      transition: 'all 0.3s',
    }),
    packageName: {
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      marginBottom: '4px',
    },
    packageDuration: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: '8px',
    },
    packagePrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      fontSize: '16px',
      marginBottom: '16px',
      outline: 'none',
      backdropFilter: 'blur(10px)',
      fontWeight: '500',
    } as React.CSSProperties,
    textarea: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      fontSize: '16px',
      marginBottom: '16px',
      outline: 'none',
      minHeight: '100px',
      resize: 'vertical' as const,
      fontFamily: 'inherit',
      backdropFilter: 'blur(10px)',
      fontWeight: '500',
    } as React.CSSProperties,
    submitButton: {
      width: '100%',
      padding: '14px 32px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #06B6D4 0%, #A855F7 100%)',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
    } as React.CSSProperties,
    alert: (type: 'error' | 'success') => ({
      padding: '12px 16px',
      borderRadius: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
      border: `1px solid ${type === 'error' ? '#EF4444' : '#22C55E'}`,
      color: type === 'error' ? '#FCA5A5' : '#86EFAC',
    }),
    emptyMessage: {
      textAlign: 'center' as const,
      padding: '20px',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '14px',
    },
    phoneInputContainer: {
      marginBottom: '16px',
    } as React.CSSProperties,
    mapContainer: {
      width: '100%',
      height: '350px',
      borderRadius: '12px',
      marginTop: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
    } as React.CSSProperties,
    locationLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#C4B5FD',
      marginBottom: '8px',
      marginTop: '16px',
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '20px'
      }}>
        <button
          onClick={handlePrevMonth}
          style={styles.navButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ChevronLeft size={20} color="white" />
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          <Calendar size={24} />
          <span>{monthNames[currentMonth]} {currentYear} - {monthNames[nextMonth]} {nextMonthYear}</span>
        </div>
        <button
          onClick={handleNextMonth}
          style={styles.navButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ChevronRight size={20} color="white" />
        </button>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={styles.legendBox('rgba(34, 197, 94, 0.2)')} />
          <span>Available</span>
        </div>
        <div style={styles.legendItem}>
          <div style={styles.legendBox('rgba(239, 68, 68, 0.3)')} />
          <span>Booked</span>
        </div>
        <div style={styles.legendItem}>
          <div style={styles.legendBox('rgba(6, 182, 212, 0.2)')} />
          <span>Today</span>
        </div>
      </div>

      {/* Two-Month Grid */}
      <div style={styles.twoMonthGrid}>
        {/* First Month */}
        <div
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = '2px solid #A855F7';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.header}>
            <div style={styles.monthTitle}>
              {monthNames[currentMonth]} {currentYear}
            </div>
          </div>

          <div style={styles.weekDaysGrid}>
            {weekDays.map(day => (
              <div key={day} style={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          <div style={styles.calendarGrid}>
            {currentMonthDays.map((day, index) => (
              <div
                key={index}
                style={styles.dayCell(day)}
                onClick={() => handleDateClick(day)}
                onMouseEnter={(e) => {
                  if (day.isAvailable && day.isCurrentMonth) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.border = '2px solid #06B6D4';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (day.isAvailable && day.isCurrentMonth) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.border = day.isToday ? '2px solid #FBBF24' : '1px solid rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div>{day.date.getDate()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Month */}
        <div
          style={styles.card}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = '2px solid #A855F7';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.header}>
            <div style={styles.monthTitle}>
              {monthNames[nextMonth]} {nextMonthYear}
            </div>
          </div>

          <div style={styles.weekDaysGrid}>
            {weekDays.map(day => (
              <div key={day} style={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>

          <div style={styles.calendarGrid}>
            {nextMonthDays.map((day, index) => (
              <div
                key={index}
                style={styles.dayCell(day)}
                onClick={() => handleDateClick(day)}
                onMouseEnter={(e) => {
                  if (day.isAvailable && day.isCurrentMonth) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.border = '2px solid #06B6D4';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (day.isAvailable && day.isCurrentMonth) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.border = day.isToday ? '2px solid #FBBF24' : '1px solid rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div>{day.date.getDate()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBookingModal && selectedDate && (
        <div style={styles.modal} onClick={() => {
          // Don't close modal if loading or showing success view
          if (!loading && !showSuccessView) {
            setShowBookingModal(false);
          }
        }}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} data-modal-content>
            <style>
              {`
                [data-modal-content] input::placeholder,
                [data-modal-content] textarea::placeholder {
                  color: rgba(255, 255, 255, 0.5);
                  opacity: 1;
                }
                [data-modal-content] input::-webkit-input-placeholder,
                [data-modal-content] textarea::-webkit-input-placeholder {
                  color: rgba(255, 255, 255, 0.5);
                  opacity: 1;
                }
                [data-modal-content] input::-moz-placeholder,
                [data-modal-content] textarea::-moz-placeholder {
                  color: rgba(255, 255, 255, 0.5);
                  opacity: 1;
                }
                [data-modal-content] input:-ms-input-placeholder,
                [data-modal-content] textarea:-ms-input-placeholder {
                  color: rgba(255, 255, 255, 0.5);
                  opacity: 1;
                }
              `}
            </style>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>
                Book Your Show - {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <button
                onClick={() => {
                  // Always allow closing via X button
                  cleanupMap();
                  setShowBookingModal(false);
                  setShowSuccessView(false);
                  setSuccess(false);
                  setBookingDetails(null);
                }}
                style={styles.closeButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <X size={20} color="white" />
              </button>
            </div>

            {!showSuccessView && error && (
              <div style={styles.alert('error')}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {showSuccessView && bookingDetails ? (
              // SUCCESS VIEW - Replaces entire form
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Big animated success checkmark */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  marginBottom: '20px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>

                <h2 style={{
                  color: '#6366f1',
                  fontSize: '28px',
                  margin: '0 0 10px 0'
                }}>
                  🎉 Booking Confirmed!
                </h2>

                <div style={{
                  background: '#dcfce7',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  margin: '20px 0',
                  border: '2px solid #10b981'
                }}>
                  <p style={{
                    margin: 0,
                    color: '#166534',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>
                    {bookingDetails.bookingId}
                  </p>
                </div>

                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#1f2937',
                  margin: '20px 0',
                  maxWidth: '500px'
                }}>
                  🚀 <strong>Awesome!</strong> Your science adventure is booked!<br />
                  Check your email (<strong>{bookingDetails.email}</strong>) for all the exciting details!
                </p>

                <a
                  href={`https://wa.me/971543771243?text=${encodeURIComponent(
                    `Hi Carls Newton! I just booked ${bookingDetails.packageType} for ${bookingDetails.date} (Booking ${bookingDetails.bookingId}). I have a question!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#25D366',
                    color: 'white',
                    padding: '15px 30px',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    margin: '20px 0',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  💬 Chat with us on WhatsApp
                </a>

                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '20px 0'
                }}>
                  We'll confirm within 24 hours! 🎉
                </p>

                <button
                  type="button"
                  onClick={() => {
                    // Reset for next booking
                    setShowSuccessView(false);
                    setSuccess(false);
                    setBookingDetails(null);
                    // Clear location-specific fields
                    setFormData(prev => ({
                      ...persistentCustomerData,
                      address: '',
                      addressDetails: '',
                      city: '',
                      latitude: null,
                      longitude: null,
                      specialRequests: '',
                    }));
                    // Clear address input
                    if (addressInputRef.current) {
                      addressInputRef.current.value = '';
                    }
                    // Keep modal open, ready for next booking
                  }}
                  style={{
                    marginTop: '30px',
                    padding: '12px 24px',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#4f46e5')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#6366f1')}
                >
                  📅 Book Another Date
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setShowSuccessView(false);
                    setSuccess(false);
                    setBookingDetails(null);
                  }}
                  style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    background: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              // FORM VIEW
              <form onSubmit={handleBooking}>
              {/* Package Selection */}
              <div style={styles.section}>
                <h3 style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  marginTop: '0'
                }}>
                  Select Package
                </h3>
                <div style={styles.packageGrid}>
                  <div
                    style={styles.packageCard(selectedPackage === 'preschool')}
                    onClick={() => {
                      setSelectedPackage('preschool');
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <div style={styles.packageName}>Preschool Special</div>
                    <div style={styles.packageDuration}>30-45 mins</div>
                    <div style={styles.packagePrice}>د.إ 1,200</div>
                  </div>
                  <div
                    style={styles.packageCard(selectedPackage === 'classic')}
                    onClick={() => {
                      setSelectedPackage('classic');
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <div style={styles.packageName}>Classic Show</div>
                    <div style={styles.packageDuration}>45-60 mins</div>
                    <div style={styles.packagePrice}>د.إ 1,800</div>
                  </div>
                  <div
                    style={styles.packageCard(selectedPackage === 'halfday')}
                    onClick={() => {
                      setSelectedPackage('halfday');
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <div style={styles.packageName}>Half-Day Experience</div>
                    <div style={styles.packageDuration}>4 hours</div>
                    <div style={styles.packagePrice}>د.إ 2,500</div>
                  </div>
                </div>
              </div>

              {/* Time Slot Selection */}
              <div style={styles.section}>
                <h3 style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  marginTop: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock size={20} style={{ color: '#667eea' }} />
                  Select Time Slot
                </h3>
                {availableTimeSlots.length > 0 ? (
                  <div style={styles.timeSlotsGrid}>
                    {availableTimeSlots.map((slot, index) => (
                      <div
                        key={index}
                        style={styles.timeSlot(selectedTimeSlot === slot)}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyMessage}>
                    {selectedPackage === 'halfday'
                      ? 'Half-day bookings require the entire day to be free. This date has other bookings.'
                      : 'No available time slots for this date.'}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div style={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '0',
                    marginTop: '0'
                  }}>
                    Contact Information
                  </h3>
                  {isProfileDataLocked ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (onProfileSettingsClick) {
                          onProfileSettingsClick();
                        }
                      }}
                      style={{
                        fontSize: '12px',
                        color: '#06B6D4',
                        textDecoration: 'underline',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Edit size={14} />
                      Update My Information
                    </button>
                  ) : (persistentCustomerData.name || persistentCustomerData.email) && (
                    <button
                      type="button"
                      onClick={() => {
                        setPersistentCustomerData({
                          title: 'Mr',
                          name: '',
                          jobPosition: '',
                          organizationName: '',
                          email: '',
                          phone: '',
                        });
                        setFormData(prev => ({
                          ...prev,
                          title: 'Mr',
                          name: '',
                          jobPosition: '',
                          organizationName: '',
                          email: '',
                          phone: '',
                        }));
                      }}
                      style={{
                        fontSize: '12px',
                        color: '#6366f1',
                        textDecoration: 'underline',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                      }}
                    >
                      Booking for a different customer?
                    </button>
                  )}
                </div>

                {/* Info banner when using profile data */}
                {isProfileDataLocked && (
                  <div style={{
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#C4B5FD',
                  }}>
                    <Lock size={14} style={{ color: '#06B6D4' }} />
                    Your saved contact information (read-only)
                  </div>
                )}

                {/* Title and Name in a row */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value as 'Mr' | 'Ms' | 'Dr' | 'Mrs' | 'Prof' })}
                    required
                    disabled={isProfileDataLocked}
                    style={{
                      width: '120px',
                      padding: '14px 16px',
                      fontSize: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontWeight: '500',
                      outline: 'none',
                      backdropFilter: 'blur(10px)',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      paddingRight: '40px',
                      marginBottom: 0
                    }}
                  >
                    <option value="Mr" style={{
                      background: '#1e293b',
                      color: '#ffffff',
                      padding: '10px'
                    }}>Mr</option>
                    <option value="Ms" style={{
                      background: '#1e293b',
                      color: '#ffffff',
                      padding: '10px'
                    }}>Ms</option>
                    <option value="Mrs" style={{
                      background: '#1e293b',
                      color: '#ffffff',
                      padding: '10px'
                    }}>Mrs</option>
                    <option value="Dr" style={{
                      background: '#1e293b',
                      color: '#ffffff',
                      padding: '10px'
                    }}>Dr</option>
                    <option value="Prof" style={{
                      background: '#1e293b',
                      color: '#ffffff',
                      padding: '10px'
                    }}>Prof</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    readOnly={isProfileDataLocked}
                    style={{
                      ...styles.input,
                      flex: 1,
                      marginBottom: 0,
                      opacity: isProfileDataLocked ? 0.7 : 1,
                      cursor: isProfileDataLocked ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Job Position (e.g., Science Coordinator, Head Teacher) *"
                  required
                  value={formData.jobPosition}
                  onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                  readOnly={isProfileDataLocked}
                  style={{
                    ...styles.input,
                    opacity: isProfileDataLocked ? 0.7 : 1,
                    cursor: isProfileDataLocked ? 'not-allowed' : 'text'
                  }}
                />

                <input
                  type="text"
                  placeholder="Enter organization or school name *"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  readOnly={isProfileDataLocked}
                  style={{
                    ...styles.input,
                    opacity: isProfileDataLocked ? 0.7 : 1,
                    cursor: isProfileDataLocked ? 'not-allowed' : 'text'
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  readOnly={isProfileDataLocked}
                  style={{
                    ...styles.input,
                    opacity: isProfileDataLocked ? 0.7 : 1,
                    cursor: isProfileDataLocked ? 'not-allowed' : 'text'
                  }}
                />
                <div style={{
                  ...styles.phoneInputContainer,
                  opacity: isProfileDataLocked ? 0.7 : 1,
                  pointerEvents: isProfileDataLocked ? 'none' : 'auto'
                }}>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="AE"
                    countries={['AE', 'SA', 'KW', 'QA', 'OM', 'BH', 'EG']}
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value || '' })}
                    placeholder="Phone Number *"
                    required
                    disabled={isProfileDataLocked}
                    style={{ position: 'relative' }}
                  />
                </div>
                <h3 style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  marginTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <MapPin size={20} style={{ color: '#667eea' }} />
                  Location
                </h3>
                <input
                  ref={addressInputRef}
                  type="text"
                  placeholder="Search for your address *"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={styles.input}
                />
                <div style={{ ...styles.mapContainer, marginBottom: '24px', position: 'relative' }}>
                  {mapLoading && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      zIndex: 10,
                    }}>
                      <div style={{ textAlign: 'center', color: '#A78BFA' }}>
                        <div style={{ marginBottom: '8px' }}>Loading map...</div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>Please wait</div>
                      </div>
                    </div>
                  )}
                  {mapError && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      zIndex: 10,
                    }}>
                      <div style={{ textAlign: 'center', color: '#FCA5A5' }}>
                        <AlertCircle size={32} style={{ marginBottom: '8px' }} />
                        <div style={{ fontSize: '14px' }}>{mapError}</div>
                      </div>
                    </div>
                  )}
                  <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                </div>
                <input
                  type="text"
                  placeholder="Apt/Flat/Building Number or Landmarks (Optional)"
                  value={formData.addressDetails}
                  onChange={(e) => setFormData({ ...formData, addressDetails: e.target.value })}
                  style={{...styles.input, marginTop: 0}}
                />
              </div>

              {/* Special Requests */}
              <div style={{ ...styles.section, marginTop: '32px' }}>
                <h3 style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  marginTop: '0'
                }}>
                  Special Requests or Topics to Cover (Optional)
                </h3>
                <textarea
                  placeholder="Any specific topics, experiments, or special requirements..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  style={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTimeSlot || loading || success}
                style={{
                  ...styles.submitButton,
                  opacity: selectedTimeSlot && !loading && !success ? 1 : 0.5,
                  cursor: selectedTimeSlot && !loading && !success ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={(e) => {
                  if (selectedTimeSlot && !loading && !success) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? 'Processing...' : success ? 'Booking Confirmed!' : 'Confirm Booking'}
              </button>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBookingCalendar;
