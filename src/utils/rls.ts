import { User } from '@/types/auth';

/**
 * Row Level Security (RLS) utility functions
 * These simulate database-level RLS policies for data access control
 */

// Check if user can access data from their company
export const canAccessCompanyData = (user: User, dataCompanyId: string): boolean => {
  return user.company_id === dataCompanyId;
};

// Check if user can read specific resource
export const canRead = (user: User, resource: { companyId: string; createdBy?: string }): boolean => {
  // Users can read data from their own company
  return canAccessCompanyData(user, resource.companyId);
};

// Check if user can create resources
export const canCreate = (user: User): boolean => {
  // All authenticated users can create resources
  return true;
};

// Check if user can update specific resource
export const canUpdate = (user: User, resource: { companyId: string; createdBy?: string }): boolean => {
  // Users can update their own company's data
  if (!canAccessCompanyData(user, resource.companyId)) return false;
  
  // Admins can update any resource in their company
  if (user.role === 'admin') return true;
  
  // Managers can update any resource in their company
  if (user.role === 'manager') return true;
  
  // Regular users can only update resources they created
  if (user.role === 'user' && resource.createdBy) {
    return user.id === resource.createdBy;
  }
  
  return false;
};

// Check if user can delete specific resource
export const canDelete = (user: User, resource: { companyId: string; createdBy?: string }): boolean => {
  // Users can only delete data from their own company
  if (!canAccessCompanyData(user, resource.companyId)) return false;
  
  // Admins can delete any resource in their company
  if (user.role === 'admin') return true;
  
  // Managers can delete any resource in their company
  if (user.role === 'manager') return true;
  
  // Regular users can only delete resources they created
  if (user.role === 'user' && resource.createdBy) {
    return user.id === resource.createdBy;
  }
  
  return false;
};

// Filter array of resources based on user's access rights
export const filterByRLS = <T extends { companyId: string; createdBy?: string }>(
  user: User,
  resources: T[]
): T[] => {
  return resources.filter(resource => canRead(user, resource));
};

// Add RLS metadata to new resources
export const addRLSMetadata = (user: User, data: any) => {
  return {
    ...data,
    companyId: user.company_id,
    createdBy: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Update RLS metadata for existing resources
export const updateRLSMetadata = (data: any) => {
  return {
    ...data,
    updatedAt: new Date().toISOString(),
  };
};

// Role-based permissions
export const hasAdminAccess = (user: User): boolean => {
  return user.role === 'admin';
};

export const hasManagerAccess = (user: User): boolean => {
  return user.role === 'admin' || user.role === 'manager';
};

export const hasUserAccess = (user: User): boolean => {
  return ['admin', 'manager', 'user'].includes(user.role);
};