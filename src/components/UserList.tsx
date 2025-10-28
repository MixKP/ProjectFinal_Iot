// src/components/UserList.tsx
export interface UserSummary {
  username: string;
  totalTodayMl: number;
}

interface UserListProps {
  users: UserSummary[];
}

export default function UserList({ users }: UserListProps) {
  if (!users || users.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No users yet. Register first.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b text-gray-600 text-[11px] uppercase tracking-wide">
          <th className="py-1">Username</th>
          <th className="py-1 text-right">Today (ml)</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.username} className="border-b last:border-0">
            <td className="py-1 text-gray-800">{u.username}</td>
            <td className="py-1 text-right text-gray-800">
              {u.totalTodayMl}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
