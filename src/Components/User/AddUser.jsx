import { useContext, useEffect, useState } from "react";
import { UserPlus, X } from "lucide-react";
import { NewChatModalContext, UserDataContext } from "../Global/GlobalData";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { Firebase } from "../Global/Firebase";
import { toast } from "react-toastify";

export const AddUser = () => {
    const [userName, setUserName] = useState("");
    const [error, setError] = useState("");
    const { showNewChatModel, setShowNewChatModel } = useContext(NewChatModalContext);
    const [matchedUsers, setMatchedUsers] = useState([]);
    const { userData } = useContext(UserDataContext);
    const [selectedUser, setSelectedUser] = useState(null);

    if (!showNewChatModel) return null;

    function handleSelectedUser(user) {
        setSelectedUser(user);
        setUserName(user.userName); // autofill selected name
    }

    // Search users
    function handleSearchUser(e) {
        const input = e.target.value;
        setUserName(input);
        const db = getDatabase(Firebase);
        const userRef = ref(db, "/usersData");

        onValue(userRef, (res) => {
            const data = res.val();
            if (!data) return;
            if (input.trim() === "") {
                setMatchedUsers([]);
                return;
            }

            const filtered = Object.entries(data)
                .filter(([key, value]) => value.name?.toLowerCase().includes(input.toLowerCase()) && key !== userData.uid)
                .map(([key, value]) => ({
                    id: key,
                    userName: value.name,
                    image: value.photo
                }));
            setMatchedUsers(filtered);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedUser) {
            setError("Please select a user from the list.");
            toast.error("Please select a user from the list.");
            return;
        }

        const db = getDatabase(Firebase);
        const newChatRef = push(ref(db, `/userMessages`)); // generate unique chatId
        const chatId = newChatRef.key;

        const createdAt = Date.now();

        const chatMetaForCurrentUser = {
            chatId,
            receiverId: selectedUser.id,
            receiverName: selectedUser.userName,
            receiverImage: selectedUser.image,
            lastMessage: "",
            lastTimestamp: createdAt,
            createdBy: userData.uid
        };

        const chatMetaForSelectedUser = {
            chatId,
            receiverId: userData.uid,
            receiverName: userData.displayName || "Unknown",
            receiverImage: userData.photo,
            lastMessage: "",
            lastTimestamp: createdAt,
            createdBy: userData.uid
        };

        toast.success("Chat created");

        Promise.all([
            set(ref(db, `/userChatList/${userData.uid}/${chatId}`), chatMetaForCurrentUser),
            set(ref(db, `/userChatList/${selectedUser.id}/${chatId}`), chatMetaForSelectedUser)
        ])
            .then(() => {
                toast.success("Chat created successfully!");
                // Auto-close modal
                setShowNewChatModel(false);
                setError("");
                setUserName("");
                setSelectedUser(null);
                setMatchedUsers([]);
            })
            .catch(() => {
                toast.error("Failed to create chat. Please try again.");
            });
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 max-w-md w-full p-6 relative">
                <button
                    onClick={() => setShowNewChatModel(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center space-x-2 mb-6">
                    <UserPlus className="w-6 h-6" /> <span>Create new chat</span>
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="userName" className="block text-gray-700 dark:text-gray-300 mb-1">
                            Search User
                        </label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={handleSearchUser}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter user name"
                        />
                    </div>

                    {selectedUser && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                            Selected: {selectedUser.userName}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            Create Chat
                        </button>
                    </div>
                </form>

                {error && <span className="text-red-500 block mt-2">{error}</span>}

                {matchedUsers.length > 0 && (
                    <div className="mt-4 max-h-48 overflow-y-auto">
                        {matchedUsers.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => handleSelectedUser(user)}
                                className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded mb-1"
                            >
                                {user.userName}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddUser;