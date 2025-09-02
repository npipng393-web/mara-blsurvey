import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Province {
  id: string;
  name: string;
  code: string;
  population: number;
  area_sq_km: number;
  capital: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  province_id: string;
  province_name?: string;
  headquarters: string;
  population: number;
  area_sq_km: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface LLG {
  id: string;
  name: string;
  code: string;
  district_id: string;
  district_name?: string;
  type: 'urban' | 'rural';
  wards_count: number;
  population: number;
  president: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Ward {
  id: string;
  name: string;
  ward_number: number;
  llg_id: string;
  llg_name?: string;
  councillor: string;
  villages_count: number;
  population: number;
  area_sq_km: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Village {
  id: string;
  name: string;
  ward_id: string;
  ward_name?: string;
  chief: string;
  population: number;
  households: number;
  languages: string[];
  access_road: boolean;
  electricity: boolean;
  water_source: string;
  health_facility: boolean;
  school: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Camp {
  id: string;
  name: string;
  location: string;
  type: 'temporary' | 'transitional' | 'permanent';
  established_date: string;
  capacity: number;
  current_population: number;
  families: number;
  camp_manager: string;
  facilities: string[];
  conditions: 'good' | 'fair' | 'poor';
  status: 'active' | 'closed' | 'planning';
  created_at: string;
  updated_at: string;
}

// Database service functions
export const provinceService = {
  async getAll(): Promise<Province[]> {
    const { data, error } = await supabase
      .from('provinces')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(province: Omit<Province, 'id' | 'created_at' | 'updated_at'>): Promise<Province> {
    const { data, error } = await supabase
      .from('provinces')
      .insert([province])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to create province: ${error.message}`);
    }
    return data;
  },

  async update(id: string, updates: Partial<Province>): Promise<Province> {
    const { data, error } = await supabase
      .from('provinces')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('provinces')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const districtService = {
  async getAll(): Promise<District[]> {
    const { data, error } = await supabase
      .from('districts')
      .select(`
        *,
        provinces(name)
      `)
      .order('name');

    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      province_name: d.provinces?.name
    }));
  },

  async getByProvinceId(provinceId: string): Promise<District[]> {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('province_id', provinceId)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(district: Omit<District, 'id' | 'created_at' | 'updated_at'>): Promise<District> {
    const { data, error } = await supabase
      .from('districts')
      .insert([district])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<District>): Promise<District> {
    const { data, error } = await supabase
      .from('districts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('districts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const llgService = {
  async getAll(): Promise<LLG[]> {
    const { data, error } = await supabase
      .from('llgs')
      .select(`
        *,
        districts(name)
      `)
      .order('name');

    if (error) throw error;
    return (data || []).map(l => ({
      ...l,
      district_name: l.districts?.name
    }));
  },

  async getByDistrictId(districtId: string): Promise<LLG[]> {
    const { data, error } = await supabase
      .from('llgs')
      .select('*')
      .eq('district_id', districtId)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(llg: Omit<LLG, 'id' | 'created_at' | 'updated_at'>): Promise<LLG> {
    const { data, error } = await supabase
      .from('llgs')
      .insert([llg])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<LLG>): Promise<LLG> {
    const { data, error } = await supabase
      .from('llgs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('llgs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const wardService = {
  async getAll(): Promise<Ward[]> {
    const { data, error } = await supabase
      .from('wards')
      .select(`
        *,
        llgs(name)
      `)
      .order('ward_number');

    if (error) throw error;
    return (data || []).map(w => ({
      ...w,
      llg_name: w.llgs?.name
    }));
  },

  async getByLLGId(llgId: string): Promise<Ward[]> {
    const { data, error } = await supabase
      .from('wards')
      .select('*')
      .eq('llg_id', llgId)
      .order('ward_number');

    if (error) throw error;
    return data || [];
  },

  async create(ward: Omit<Ward, 'id' | 'created_at' | 'updated_at'>): Promise<Ward> {
    const { data, error } = await supabase
      .from('wards')
      .insert([ward])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Ward>): Promise<Ward> {
    const { data, error } = await supabase
      .from('wards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('wards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const villageService = {
  async getAll(): Promise<Village[]> {
    const { data, error } = await supabase
      .from('villages')
      .select(`
        *,
        wards(name)
      `)
      .order('name');

    if (error) throw error;
    return (data || []).map(v => ({
      ...v,
      ward_name: v.wards?.name
    }));
  },

  async getByWardId(wardId: string): Promise<Village[]> {
    const { data, error } = await supabase
      .from('villages')
      .select('*')
      .eq('ward_id', wardId)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(village: Omit<Village, 'id' | 'created_at' | 'updated_at'>): Promise<Village> {
    const { data, error } = await supabase
      .from('villages')
      .insert([village])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Village>): Promise<Village> {
    const { data, error } = await supabase
      .from('villages')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('villages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const campService = {
  async getAll(): Promise<Camp[]> {
    const { data, error } = await supabase
      .from('camps')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(camp: Omit<Camp, 'id' | 'created_at' | 'updated_at'>): Promise<Camp> {
    const { data, error } = await supabase
      .from('camps')
      .insert([camp])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Camp>): Promise<Camp> {
    const { data, error } = await supabase
      .from('camps')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('camps')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
