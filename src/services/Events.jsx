import { collection, addDoc, doc, updateDoc, arrayUnion, Timestamp }  from 'firebase/firestore';
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
