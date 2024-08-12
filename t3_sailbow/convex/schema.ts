import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const tripSchema = {
    name: v.string(),
    slug: v.optional(v.string()),
    description: v.string(),
    banner: v.union(
        v.null(),
        v.object({
            alt: v.string(),
            thumbnail: v.string(),
            small: v.string(),
            regular: v.string(),
            full: v.string(),
        })
    ),
}

export const crewMemberSchema = {
    tripId: v.id("trips"),
    userId: v.optional(v.string()),
    email: v.string(),
    role: v.union(
        v.literal("captain"),
        v.literal("firstMate"),
        v.literal("crewMember")
    )
}

const baseModuleSchema = {
    tripId: v.id("trips"),
}

export const moduleSchema = v.union(
    v.object({
        ...baseModuleSchema,
        type: v.literal("date"),
        startDate: v.string(),
        startTime: v.optional(v.string()),
        endDate: v.optional(v.string()),
        endTime: v.optional(v.string())
    }),
    v.object({
        ...baseModuleSchema,
        type: v.literal("location"),
        address: v.string()
    })
)

export const commentsSchema = {
    userId: v.string(),
    message: v.string(),
}

export const announcementSchema = {
    tripId: v.id("trips"),
    title: v.string(),
    text: v.string()
}

export const announcementCommentsSchema = {
    announcementId: v.id("announcements"),
    commentId: v.id("comments")
}

export const pollSchema = {
    tripId: v.id("trips"),
    title: v.string(),
    settings: v.object({
        allowMultipleVotes: v.boolean(),
        anonymousVoting: v.boolean()
    })
}

export const pollOptionSchema = {
    pollId: v.id("polls"),
    votes: v.array(v.string()),
    option: moduleSchema
}

export const userSchema = {
    externalId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.string(),
    email: v.string()
}


export default defineSchema({
    users: defineTable(userSchema)
        .index("by_externalId", ["externalId"])
        .index("by_email", ["email"]),

    trips: defineTable(tripSchema)
        .searchIndex("search_trip_name", {
            searchField: "name",
        }),

    crews: defineTable(crewMemberSchema)
        .index("by_userId", ["userId"])
        .index("by_userId_and_tripId", ["userId", "tripId"])
        .index("by_tripId", ["tripId"])
        .index("by_email", ["email"]),

    announcements: defineTable(announcementSchema)
        .index("by_tripId", ["tripId"]),

    announcementComments: defineTable(announcementCommentsSchema)
        .index("by_announcementId", ["announcementId"]),
    
    comments: defineTable(commentsSchema),

    modules: defineTable(moduleSchema)
        .index("by_tripId", ["tripId"]),

    polls: defineTable(pollSchema)
        .index("by_tripId", ["tripId"]),

    pollOptions: defineTable(pollOptionSchema)
        .index("by_pollId", ["pollId"])
})