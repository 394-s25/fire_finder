import { collection, addDoc, doc, updateDoc, getDoc , arrayUnion, Timestamp }  from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from './firestoreConfig';

const storage = getStorage();

export const createEvent = async (eventData, imageFile) => {
    try {
        const { title, startDate, endDate, location, description } = eventData;
        const userId = auth.currentUser?.uid;

        if (!userId) {
        throw new Error('User not authenticated');
        }

        // Validate required fields
        if (!title || !startDate || !endDate || !location || !description) {
        throw new Error('Missing required fields');
        }

        // Handle image upload if provided
        let imageUrl = '';
        if (imageFile) {
        const fileName = `events/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        
        // Upload image to Firebase Storage
        await uploadBytes(storageRef, imageFile);
        
        // Get the download URL
        imageUrl = await getDownloadURL(storageRef);
        }

        // Prepare event data
        const event = {
        title,
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        location,
        description,
        image: imageUrl,
        rsvp: [],
        saved: [],
        postedBy: userId,
        createdAt: Timestamp.now(),
        };

        // Write to Firestore
        const docRef = await addDoc(collection(db, 'events'), event);

        //return { id: docRef.id, ...event };
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const getUserRSVPedEvents = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
        throw new Error('User not authenticated');
        }

    try {
        const studentRef = doc(db, "students", userId);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
            return []; // No student document, return empty array
        }
    
        const studentData = studentSnap.data();
        const rsvpEventRefs = studentData.rsvp || []; // Array of event references
    
        // Fetch all event documents
        const eventPromises = rsvpEventRefs.map((eventRef) => getDoc(eventRef));
        const eventSnaps = await Promise.all(eventPromises);
    
        // Current date and time (dynamic)
        const now = new Date();
    
        // Map to event objects with id and data, filter for future events
        const futureEvents = eventSnaps
            .filter((snap) => snap.exists()) // Only include existing events
            .filter((snap) => {
            const startDate = snap.data().startDate?.toDate();
            return startDate && startDate > now; // Only events starting in the future
            })
            .map((snap) => ({
            id: snap.id,
            ...snap.data(),
            }));
    
        return futureEvents;
    } catch (error) {
        console.error("Error fetching future RSVPed events:", error);
        throw new Error("Failed to fetch future RSVPed events");
    }
};

export const getUserSavedEvents = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    try {
        const studentRef = doc(db, "students", userId);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
            return []; // No student document, return empty array
        }

        const studentData = studentSnap.data();
        const savedEventRefs = studentData.saved || []; // Array of event references

        // Fetch all event documents
        const eventPromises = savedEventRefs.map((eventRef) => getDoc(eventRef));
        const eventSnaps = await Promise.all(eventPromises);

        // Map to event objects with id and data
        const events = eventSnaps
            .filter((snap) => snap.exists()) // Only include existing events
            .map((snap) => ({
            id: snap.id,
            ...snap.data(),
            }));

        return events;
    } catch (error) {
        console.error("Error fetching saved events:", error);
        throw new Error("Failed to fetch saved events");
    }
};

export const getUserPastAttendedEvents = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
        throw new Error('User not authenticated');
    }

    
    try {
        const studentRef = doc(db, "students", userId);
        const studentSnap = await getDoc(studentRef);
    
        if (!studentSnap.exists()) {
            return []; // No student document, return empty array
        }
    
        const studentData = studentSnap.data();
        const rsvpEventRefs = studentData.rsvp || []; // Array of event references
    
        // Fetch all event documents
        const eventPromises = rsvpEventRefs.map((eventRef) => getDoc(eventRef));
        const eventSnaps = await Promise.all(eventPromises);
    
        // Current date and time (dynamically fetched)
        const now = new Date();
        
        // Map to event objects with id and data, filter for past events
        const pastEvents = eventSnaps
            .filter((snap) => snap.exists()) // Only include existing events
            .filter((snap) => {
            const endDate = snap.data().endDate?.toDate();
            return endDate && endDate < now; // Only events that have ended
            })
            .map((snap) => ({
            id: snap.id,
            ...snap.data(),
            }));
            
        return pastEvents;
    } catch (error) {
        console.error("Error fetching past attended events:", error);
        throw new Error("Failed to fetch past attended events");
    }
};