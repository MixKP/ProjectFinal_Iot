export type UserSummary = {
  name: string;
  useWater: number;
};

type UserListProps = {
  users: UserSummary[];
};

export function UserList({ users }: UserListProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        User Usage
      </h3>

      {users.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No usage yet.</p>
      ) : (
        users.map((u, i) => (
          <UserCard key={i} name={u.name} useWater={u.useWater} />
        ))
      )}
    </section>
  );
}

// อย่าลืม import UserCard ด้านบนของไฟล์:
import { UserCard } from "./UserCard";
