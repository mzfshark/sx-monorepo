import { defineStore } from 'pinia';
import { Contact } from '@/types';
import pkg from '../../package.json';

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    contacts: useStorage(`${pkg.name}.contacts`, [] as Contact[]),
    activePage: useStorage(`${pkg.name}.activePage`, '')
  }),
  actions: {
    setActivePage(page: string) {
      this.activePage = page;
    },
    saveContact(payload: Contact) {
      const contact = this.contacts.find(
        contact => contact.address === payload.address
      );
      if (contact) {
        Object.entries(payload).map(([key, value]) => {
          contact[key] = value;
        });
      } else {
        this.contacts.unshift(payload);
      }
    },
    deleteContact(address: string) {
      this.contacts = this.contacts.filter(
        contact => contact.address !== address
      );
    }
  }
});
