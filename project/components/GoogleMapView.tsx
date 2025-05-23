import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import Svg, { Path } from 'react-native-svg';
import { Platform, View } from 'react-native';

const section = Platform.OS === 'web' ? 'section' : View;

type GoogleMapViewProps = {
    initialAddress: string;
};

const GoogleMapView: React.FC<GoogleMapViewProps> = ({ initialAddress }) => {
    const [address, setAddress] = useState(initialAddress);
    const [searchAddress, setSearchAddress] = useState(initialAddress);

    useEffect(() => {
        setAddress(initialAddress);
        setSearchAddress(initialAddress);
    }, [initialAddress]);

    const handleSearch = () => setSearchAddress(address);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const encodedAddress = encodeURIComponent(searchAddress);
    const mapEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

    const openDirections = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        window.open(url, '_blank');
    };

    return (
        <React.Fragment>
            {/* Search Bar */}
            <section className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 gap-4">
                <section className="relative w-full max-w-2xl">
                    <view className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <MapPin className="h-7 w-7 text-gray-400" />
                    </view>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter location..."
                        className="block w-full pl-16 pr-28 py-6 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="absolute inset-y-0 right-0 px-8 py-4 bg-blue-500 text-white rounded-r-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center text-lg"
                    >
                        <Search className="h-6 w-6 mr-2" />
                        Search
                    </button>
                </section>
                {/* Map */}
                <section className="w-full max-w-3xl ml-[-32px] aspect-video rounded-2xl overflow-hidden shadow border border-gray-200 bg-white">
                    <iframe
                        title="Google Map"
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: 400 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </section>
                {/* Directions Button */}
                <button
                    type="button"
                    onClick={openDirections}
                    className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow text-base mt-2"
                >
                    <Navigation className="h-6 w-6 mr-2" />
                    Get Directions
                </button>
            </section>
        </React.Fragment>
    );
};

export default GoogleMapView;