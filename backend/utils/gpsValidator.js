const toRadians = (degree) => {

    return degree * (Math.PI / 180);

};

const calculateDistance = (

    lat1,

    lon1,

    lat2,

    lon2

) => {

    const earthRadius = 6371000;

    const dLat = toRadians(lat2 - lat1);

    const dLon = toRadians(lon2 - lon1);

    const a =

        Math.sin(dLat / 2) *

        Math.sin(dLat / 2)

        +

        Math.cos(toRadians(lat1))

        *

        Math.cos(toRadians(lat2))

        *

        Math.sin(dLon / 2)

        *

        Math.sin(dLon / 2);

    const c =

        2 *

        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(1 - a)

        );

    return earthRadius * c;

};

export const validateGPS = (

    libraryLat,

    libraryLng,

    studentLat,

    studentLng,

    allowedRadius

) => {

    const distance = calculateDistance(

        libraryLat,

        libraryLng,

        studentLat,

        studentLng

    );

    return {

        isValid:

            distance <= allowedRadius,

        distance

    };

};