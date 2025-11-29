"use client"
import { motion } from "motion/react";
import { UserButton } from "@clerk/nextjs";
export function ClerkUser() {
    return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute right-4 top-12"
    >
        <UserButton />
    </motion.div>
    )
}