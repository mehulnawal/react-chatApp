import { useContext, useState } from "react";
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
    }

    // searching user
    // searching user
    function handleSearchUser(e) {
        setUserName(e.target.value);
        const userInput = e.target.value.toLowerCase();
        const db = getDatabase(Firebase);
        const userRef = ref(db, "/usersData");
        onValue(userRef, (res) => {
            const data = res.val();
            if (userInput !== "") {
                const userNames = Object.entries(data)
                    .filter(
                        ([key, value]) =>
                            value.name && typeof value.name === "string" &&
                            value.name.toLowerCase().includes(userInput) &&
                            value.id !== userData.uid
                    )
                    .map(([key, value]) => ({
                        id: value.id,
                        userName: value.name,
                        image: value.photo
                    }));
                setMatchedUsers(userNames);
            } else {
                setMatchedUsers([]);
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userName.trim() === "") {
            setError("Name is required.");
            toast.error("Name is required.");
            return;
        } else if (!selectedUser) {
            setError("Please select a user from the list.");
            toast.error("Please select a user from the list.");
            return;
        } else {
            const date = new Date();
            const todayDate = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const createdAt = `${todayDate}${month}${year}${hours}${minutes}`;

            const db = getDatabase(Firebase);
            let creatorId = userData.uid;
            const receiverId = selectedUser.id;

            const newChatRef = push(ref(db, `/userChatList/${creatorId}`));
            const chatId = newChatRef.key;

            set(newChatRef, {
                chatId: chatId,
                createdBy: creatorId,
                creationDate: createdAt,
                receiverId: receiverId,
                receiverName: selectedUser.userName,
                receiverImage: selectedUser.image,
                isSeen: false,
                lastMessage: "",
            })
                .then(() => {
                    toast.success("Chat created successfully!");
                    setShowNewChatModel(false);
                    setError("");
                    setUserName("");
                    setSelectedUser(null);
                    setMatchedUsers([]);
                })
                .catch(() => {
                    toast.error("Failed to create chat. Please try again.");
                });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 max-w-md w-full p-6 relative">
                <button
                    onClick={() => setShowNewChatModel(!showNewChatModel)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Close add user form"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center space-x-2 mb-6">
                    <UserPlus className="w-6 h-6" />
                    <span>Create new chat</span>
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* user search input */}
                    <div>
                        <label htmlFor="userName" className="block text-gray-700 dark:text-gray-300 mb-1">
                            Search User
                        </label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={handleSearchUser}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter user name"
                        />
                    </div>

                    {/* show selected users */}
                    {selectedUser && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-white">
                            Selected: {selectedUser.userName}
                        </div>
                    )}

                    {/* submit button */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            Create Chat
                        </button>
                    </div>
                </form>

                <span className="text-red-500 block mt-2">{error}</span>

                {matchedUsers && matchedUsers.length > 0 ? (
                    matchedUsers.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => handleSelectedUser(user)}
                            className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded mb-1"
                        >
                            {user.userName}
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-6 text-lg dark:text-gray-300 text-gray-700">
                        No matched users
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddUser;