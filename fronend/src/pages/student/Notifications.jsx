import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Bell,
    CheckCircle,
    Trash2
} from "lucide-react";

import notificationService from "../../services/notificationService";
import socket from "../../socket/socket";

const Notifications = () => {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        loadNotifications();

        socket.on("newNotification", (notification) => {

            setNotifications(prev => [

                notification,

                ...prev

            ]);

            toast.success(notification.title);

        });

        return () => {

            socket.off("newNotification");

        };

    }, []);

    const loadNotifications = async () => {

        try {

            const res = await notificationService.getMyNotifications();

            setNotifications(res.notifications);

        }

        catch (error) {

            console.log(error);

        }

    };

    const markAsRead = async (id) => {

        await notificationService.markAsRead(id);

        setNotifications(prev =>

            prev.map(item =>

                item._id === id

                    ? {

                        ...item,

                        isRead: true

                    }

                    : item

            )

        );

    };

    const deleteNotification = async (id) => {

        await notificationService.deleteNotification(id);

        setNotifications(prev =>

            prev.filter(item => item._id !== id)

        );

    };

    return (

        <div className="space-y-6">

            <div className="flex items-center gap-3">

                <Bell className="text-blue-600"/>

                <h1 className="text-3xl font-bold">

                    Notifications

                </h1>

            </div>

            {

                notifications.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-12 text-center">

                        <Bell

                            size={60}

                            className="mx-auto text-gray-400"

                        />

                        <h2 className="mt-5 text-xl font-semibold">

                            No Notifications

                        </h2>

                    </div>

                )

            }

            {

                notifications.map(item => (

                    <div

                        key={item._id}

                        className={`

                            bg-white

                            rounded-xl

                            shadow

                            p-6

                            border-l-4

                            ${

                                item.isRead

                                ?

                                "border-green-500"

                                :

                                "border-blue-600"

                            }

                        `}

                    >

                        <div className="flex justify-between">

                            <div>

                                <h2 className="text-xl font-bold">

                                    {item.title}

                                </h2>

                                <p className="text-gray-600 mt-2">

                                    {item.message}

                                </p>

                                <p className="text-sm text-gray-400 mt-3">

                                    {

                                        new Date(

                                            item.createdAt

                                        ).toLocaleString()

                                    }

                                </p>

                            </div>

                            <div className="flex gap-2">

                                {

                                    !item.isRead && (

                                        <button

                                            onClick={() =>

                                                markAsRead(item._id)

                                            }

                                            className="bg-green-600 text-white p-2 rounded"

                                        >

                                            <CheckCircle size={18}/>

                                        </button>

                                    )

                                }

                                <button

                                    onClick={() =>

                                        deleteNotification(item._id)

                                    }

                                    className="bg-red-600 text-white p-2 rounded"

                                >

                                    <Trash2 size={18}/>

                                </button>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

};

export default Notifications;