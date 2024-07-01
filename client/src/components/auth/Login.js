import { useState } from 'react';
import { loginFields } from "../../constants/formFields";
import FormAction from "../FormAction";
import InputField from "../Input";
import NotificationBanner from "../NotificationBanner";
import useNotification from '../../services/useNotification';
import { authenticateUser } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// import {Input} from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";

const fields = loginFields;
let fieldsState = {};
fields.forEach(field => fieldsState[field.id] = '');

export default function Login() {
    const { setToken } = useAuth();
    const [loginState, setLoginState] = useState(fieldsState);
    const navigate = useNavigate();

    const { notification, showNotification, closeNotification } = useNotification();

    const handleChange = (e) => {
        setLoginState({ ...loginState, [e.target.id]: e.target.value })
    }

    const handleClick = (e) => {
        e.preventDefault();
        authenticateUser(loginState, showNotification, setToken, () => navigate('/home'));
    }

    return (
        <div>
            {notification && (
                <NotificationBanner
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}

            <div className="flex flex-col items-center justify-center " style={{ height: '85vh' }}>
                <div className="bg-white p-5 lg:p-8 rounded shadow-xl border-1 border-slate-100 w-11/12 lg:w-96 mx-2">
                    <h1 className="text-2xl font-bold mb-4 text-gray-600 text-center">Sign In</h1>
                    <div className="mb-4">
                        {
                            fields.map(field =>
                                <InputField
                                    key={field.id}
                                    handleChange={handleChange}
                                    value={loginState[field.id]}
                                    labelText={field.labelText}
                                    labelFor={field.labelFor}
                                    id={field.id}
                                    name={field.name}
                                    type={field.type}
                                    isRequired={field.isRequired}
                                    placeholder={field.placeholder}
                                    error={field.error}
                                    errorMessage={field.errorMessage}
                                />

                            )
                        }
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Checkbox defaultSelected radius="sm" color='foreground' size="sm"> Remember me</Checkbox>
                        </div>
                        <a href="#" className="text-sm font-normal text-blue-700">Forgot password?</a>
                    </div>
                    <FormAction handleClick={handleClick} text="Login"  />
                    <p className="mt-4 text-sm text-gray-600 text-center">
                        Not a user? <a href="signup" className="text-blue-700 font-semibold">Sign up</a>
                    </p>
                </div>
            </div>

        </div>
    )
}
