const teachers = [
    {
        id: 't-1',
        name: 'Elena Rodriguez',
        styles: ['Salsa', 'Bachata'],
        hourlyRate: 30,
        location: 'Paris, 11th Arr',
        rating: 4.8,
        reviewsCount: 124,
        image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=600',
        bio: 'Professional Latin dance instructor with 10 years of experience. I focus on musicality and connection.',
        availability: ['Mon 18:00', 'Tue 19:00', 'Sat 10:00']
    },
    {
        id: 't-2',
        name: 'Marcus Chen',
        styles: ['Hip-hop', 'Street Jazz'],
        hourlyRate: 35,
        location: 'Paris, 13th Arr',
        rating: 4.9,
        reviewsCount: 89,
        image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=600',
        bio: 'Choreographer for several music videos. Learn to groove and find your own style.',
        availability: ['Wed 17:00', 'Fri 18:00']
    },
    {
        id: 't-3',
        name: 'Sophie Dubois',
        styles: ['Ballet', 'Contemporary'],
        hourlyRate: 40,
        location: 'Paris, 4th Arr',
        rating: 5.0,
        reviewsCount: 45,
        image: 'https://images.unsplash.com/photo-1518834107812-1b4d0df6b8b6?auto=format&fit=crop&q=80&w=600',
        bio: 'Former opera dancer. I teach technique and expression for all levels.',
        availability: ['Mon 10:00', 'Thu 14:00']
    },
    {
        id: 't-4',
        name: 'Lucas Silva',
        styles: ['Samba', 'Capoeira'],
        hourlyRate: 25,
        location: 'Paris, 18th Arr',
        rating: 4.7,
        reviewsCount: 67,
        image: 'https://images.unsplash.com/photo-1516515429572-1b606325bd63?auto=format&fit=crop&q=80&w=600', // Capoeira/Dance vibe
        bio: 'Bring the brazilian energy to your dance floor.',
        availability: ['Tue 18:00', 'Sat 14:00']
    }
];

const bookings = [];

module.exports = { teachers, bookings };
