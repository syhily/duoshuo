import { relations } from 'drizzle-orm';
import {
  bigint,
  bigserial,
  boolean,
  char,
  index,
  inet,
  jsonb,
  pgSchema,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const schema = pgSchema('duoshuo');

const primaryKey: { mode: 'number'; unsigned: boolean } = { mode: 'number', unsigned: true };

// Common columns for all the tables used in the duoshuo.
const commonColumns = {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createTime: timestamp('create_time', { precision: 6, withTimezone: true }).notNull().defaultNow(),
  updateTime: timestamp('update_time', { precision: 6, withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

const logicDeleteColumns = {
  ...commonColumns,
  // The 'deleted' column serves for logical deletion. A value of 0 indicates the record is active.
  // When a record is deleted, the 'deleted' column will store the timestamp of the deletion.
  deleted: timestamp('deleted', { precision: 6, withTimezone: true }),
};

// The configuration table for storing all the system configurations.
// This table only supports upsert.
// Deletion isn't allowed on this table.
export const configs = schema.table('configs', {
  ...commonColumns,
  name: varchar('name', { length: 128 }).notNull().unique(),
  value: jsonb('value').notNull(),
});

// The registered user and administrator.
// If the user deleted his or her account, it can't be recovered because it's a logic deletion.
export const users = schema.table(
  'users',
  {
    ...logicDeleteColumns,
    email: varchar('email', { length: 256 }).notNull().unique(),
    nickName: varchar('nick_name', { length: 64 }).notNull(),
    registered: boolean('registered').default(false),
    verified: boolean('verified').default(false),
    password: varchar('password', { length: 512 }),
    salt: varchar('salt', { length: 128 }),
    admin: boolean('admin').default(false),
    friend: boolean('friend').default(false),
    homepage: varchar('homepage', { length: 256 }),
    lastLoginIP: inet('last_login_ip'),
    lastLoginUA: text('last_login_ua'),
  },
  (table) => ({
    deleteIdx: index('users_deleted_idx').on(table.deleted),
  }),
);

// Some user may have more than one nickname in different time range.
// But given they are all for the same user internally.
// We would like to define it as a mask for the user.
// Anyone can have the mast freely but with only one limitation.
// That is, you can't have more than two masks which is the same as others.
export const usersMask = schema.table(
  'users_mask',
  {
    ...commonColumns,
    nickname: varchar('nick_name', { length: 64 }).notNull(),
    userId: bigint('user_id', primaryKey).notNull(),
  },
  (table) => ({
    nicknameIdx: index('users_mask_nick_name_idx').on(table.nickname),
    userIdIdx: index('users_mask_user_id_idx').on(table.userId),
  }),
);

// Storing the posts' meta.
export const posts = schema.table(
  'posts',
  {
    ...logicDeleteColumns,
    title: varchar('title', { length: 512 }),
    requestPath: varchar('request_path', { length: 512 }).notNull().unique(),
    clicks: bigint('clicks', primaryKey).default(0),
    likes: bigint('likes', primaryKey).default(0),
  },
  (table) => ({
    deletedIdx: index('posts_deleted_idx').on(table.deleted),
    titleIdx: index('posts_title_idx').on(table.title),
  }),
);

// The mapping for the post's identity and the post's id.
// We can add multiple identities to the same post id.
// This is quite useful for migration and when the user changes the post's identity.
export const postsIdentity = schema.table(
  'posts_identity',
  {
    ...logicDeleteColumns,
    identity: varchar('identity', { length: 128 }).notNull().unique(),
    postId: bigint('post_id', primaryKey).notNull(),
  },
  (table) => ({
    postIdIdx: index('posts_identity_post_id_idx').on(table.postId),
  }),
);

// The table for storing a user-unrelated token with the post id.
// Used for marking if someone has liked this posts anonymously.
// We only store the anonymous like within a month by default.
// The likes from login users will be kept forever.
// The administrator can configure the storing time range for anonymous like.
export const postsLike = schema.table(
  'posts_like',
  {
    ...commonColumns,
    postId: bigint('post_id', primaryKey).notNull(),
    anonymousToken: char('anonymous_token', { length: 128 }),
    userId: bigint('user_id', primaryKey),
  },
  (table) => ({
    postIdIdx: index('posts_like_post_id_idx').on(table.postId),
    anonymousTokenIdx: index('posts_like_anonymous_token_idx').on(table.anonymousToken),
    userIdIdx: index('posts_like_user_id_idx').on(table.userId),
  }),
);

// The comments' table for storing the users' comments.
export const comments = schema.table(
  'comments',
  {
    ...logicDeleteColumns,
    maskId: bigint('mask_id', primaryKey).notNull(),
    postId: bigint('post_id', primaryKey).notNull(),
    content: text('content'),
    pending: boolean('pending').default(false),
    collapsed: boolean('collapsed').default(false),
    pinned: boolean('pinned').default(false),
    ip: inet('ip'),
    ua: text('ua'),
    likes: bigint('likes', primaryKey).default(0),
    parentId: bigint('parent_id', primaryKey),
    threadId: bigint('thread_id', primaryKey),
  },
  (table) => ({
    maskIdIdx: index('comments_mask_id_idx').on(table.maskId),
    commentsIdx: index('comments_idx').on(table.deleted, table.postId, table.threadId),
    parentIdIdx: index('comments_parent_id_idx').on(table.parentId),
  }),
);

// The optional like button for comments.
export const commentsLike = schema.table(
  'comments_like',
  {
    ...commonColumns,
    commentId: bigint('comment_id', primaryKey).notNull(),
    anonymousToken: char('anonymous_token', { length: 128 }),
    userId: bigint('user_id', primaryKey),
  },
  (table) => ({
    commentIdIdx: index('comments_like_comment_id_idx').on(table.commentId),
    anonymousTokenIdx: index('comments_like_anonymous_token_idx').on(table.anonymousToken),
    userIdIdx: index('comments_like_user_id_id').on(table.userId),
  }),
);

// Relations.
export const usersRelations = relations(usersMask, ({ one }) => ({
  user: one(users, {
    fields: [usersMask.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(postsIdentity, ({ one }) => ({
  post: one(posts, {
    fields: [postsIdentity.postId],
    references: [posts.id],
  }),
}));
