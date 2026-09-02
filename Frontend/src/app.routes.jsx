import { createBrowserRouter } from "react-router";

import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Protected from "./features/auth/components/protected";

import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import PrivacyPolicy from "./features/interview/pages/PrivacyPolicy";
import TermsOfService from "./features/interview/pages/TermsOfService";
import HelpCenter from "./features/interview/pages/HelpCenter";

import Navbar from "./features/interview/components/Navbar";


export const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },

    {
        path: "/login",
        element: <Login />
    },

    {
        path: "/",
        element: (
            <Protected>
                <>
                    <Navbar />
                    <Home />
                </>
            </Protected>
        )
    },

    {
        path: "/interview/:interviewId",
        element: (
            <Protected>
                <>
                    <Navbar />
                    <Interview />
                </>
            </Protected>
        )
    },

    {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
    },

    {
        path: "/terms-of-service",
        element: <TermsOfService />
    },

    {
        path: "/help",
        element: <HelpCenter />
    }
]);