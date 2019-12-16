export interface SideBarItem {
    name: string;
    path?: string;
    icon?: string;
    href?: string;
    target?: string;
}

export interface SideBarConfig {
    products: SideBarItem[];
    socialMedia: SideBarItem[];
}
