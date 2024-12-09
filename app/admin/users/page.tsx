"use client";

import { Card } from "@/components/ui/card";
import { IconMail, IconCalendar, IconTrash } from "@tabler/icons-react";
import { formatDistance } from "date-fns";
import { Button } from "@/components/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserWithStats extends User {
  totalSpent: number;
  totalReferrals: number;
  totalCommissions: number;
  purchases: Purchase[];
  referralCodes: (ReferralCode & {
    uses: ReferralUse[];
    commissions: Commission[];
  })[];
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
}

interface Purchase {
  amount: number;
  status: string;
}

interface ReferralCode {
  uses: ReferralUse[];
  commissions: Commission[];
}

interface ReferralUse {
  id: string;
}

interface Commission {
  status: string;
  amount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithStats | null>(null);

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  // 在组件加载时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  // 删除用户
  const handleDeleteUser = async (user: UserWithStats) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsLoading(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage your users and their permissions
          </p>
        </div>

        <div className="grid gap-4">
          {users.map((user: UserWithStats) => (
            <Card key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <div className="text-xl font-bold text-neutral-500">
                        {(user.name || user.email || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{user.name || "No name"}</div>
                    <div className="flex items-center text-sm text-neutral-500">
                      <IconMail className="mr-1 h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-neutral-500">
                      <IconCalendar className="mr-1 h-4 w-4" />
                      Joined {formatDistance(new Date(user.createdAt), new Date())} ago
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-8 text-sm">
                  <div>
                    <div className="font-medium">${(user.totalSpent / 100).toFixed(2)}</div>
                    <div className="text-neutral-500">Total Spent</div>
                  </div>
                  <div>
                    <div className="font-medium">{user.totalReferrals}</div>
                    <div className="text-neutral-500">Referrals</div>
                  </div>
                  <div>
                    <div className="font-medium">${(user.totalCommissions / 100).toFixed(2)}</div>
                    <div className="text-neutral-500">Earned</div>
                  </div>
                  <div>
                    <div className="font-medium">{user.role}</div>
                    <div className="text-neutral-500">Role</div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteUser(user)}
                    disabled={isLoading || user.role === 'admin'}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.name || userToDelete?.email}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isLoading}
              className="bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 