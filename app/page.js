'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { Box, Modal, TextField, Typography, Stack, Button, Input, Select, MenuItem } from '@mui/material';
import { query, collection, getDocs, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase'; // Ensure this path is correct

export default function Home() {
    // State variables
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [itemQuantity, setItemQuantity] = useState('')
    const [itemImage, setItemImage] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [itemToDelete, setItemToDelete] = useState('')

    // Fetch and update inventory from Firestore
    const updateInventory = async () => {
      const inventoryRef = collection(db, 'inventory');
      const snapshot = await getDocs(query(inventoryRef));
      const inventoryList = snapshot.docs.map(doc => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
    }
     
    // Remove an item or decrease its quantity
    const removeItem = async (item) => {
      const docRef = doc(db, 'inventory', item);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
        }
      }
      await updateInventory();
    }
  
    // Add an item or increase its quantity
    const addItem = async (item) => {
      const docRef = doc(db, 'inventory', item);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
      } else {
        await setDoc(docRef, { quantity: 1, image: itemImage });
      }
      await updateInventory();
    }

    // Fetch inventory on component mount
    useEffect(() => {
      updateInventory();   
    }, [])
    
    // Modal control functions
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      setOpen(false);
      setItemName('');
      setItemQuantity('');
      setItemImage(null);
    }

    const handleDeleteOpen = () => setDeleteOpen(true);
    const handleDeleteClose = () => {
      setDeleteOpen(false);
      setItemToDelete('');
    }

    // Add a new item to the inventory
    const handleAddNewItem = async () => {
      if (itemName && itemQuantity) {
        const docRef = doc(db, 'inventory', itemName);
        await setDoc(docRef, { quantity: parseInt(itemQuantity), image: itemImage });
        await updateInventory();
        handleClose();
      }
    }

    // Delete an item from the inventory
    const handleDeleteItem = async () => {
      if (itemToDelete) {
        const docRef = doc(db, 'inventory', itemToDelete);
        await deleteDoc(docRef);
        await updateInventory();
        handleDeleteClose();
      }
    }

    // Filter inventory based on search term
    const filteredInventory = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Main component render
    return (
      <Box 
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ backgroundColor: '#C5EFCB' }} // Light green
      >
        {/* Page Title */}
        <Typography variant="h2" color="#020402" my={4}> {/* Nearly black */}
          Manage Pantry
        </Typography>

        {/* Search Input */}
        <TextField
          label="Search Items"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '50%', mb: 2, backgroundColor: '#A9C5A0' }} // Soft green
        />

        {/* Add New Item and Delete Item Buttons */}
        <Stack direction="row" spacing={2} mb={2}>
          <Button 
            variant="contained" 
            onClick={handleOpen}
            sx={{ backgroundColor: '#758173', color: '#C5EFCB' }} // Muted green, Light green
          >
            Add New Item
          </Button>
          <Button 
            variant="contained" 
            onClick={handleDeleteOpen}
            sx={{ backgroundColor: '#758173', color: '#C5EFCB' }} // Muted green, Light green
          >
            Delete Item
          </Button>
        </Stack>

        {/* Add New Item Modal */}
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="#A9C5A0" // Soft green
            border="2px solid #020402" // Nearly black
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3} 
            sx={{
              transform: "translate(-50%,-50%)"
            }}
          >
            <Typography variant="h6" color="#020402"> {/* Nearly black */}
              Add Item
            </Typography>
            <TextField
              label="Item Name"
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              label="Quantity"
              variant='outlined'
              type="number"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <Input
              type="file"
              onChange={(e) => setItemImage(URL.createObjectURL(e.target.files[0]))}
            />
            <Button 
              variant="contained" 
              onClick={handleAddNewItem}
              sx={{ backgroundColor: '#758173', color: '#C5EFCB' }} // Muted green, Light green
            >
              Add
            </Button>
          </Box>
        </Modal>

        {/* Delete Item Modal */}
        <Modal open={deleteOpen} onClose={handleDeleteClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="#A9C5A0" // Soft green
            border="2px solid #020402" // Nearly black
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3} 
            sx={{
              transform: "translate(-50%,-50%)"
            }}
          >
            <Typography variant="h6" color="#020402"> {/* Nearly black */}
              Delete Item
            </Typography>
            <Select
              value={itemToDelete}
              onChange={(e) => setItemToDelete(e.target.value)}
              fullWidth
            >
              {inventory.map(item => (
                <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
              ))}
            </Select>
            <Button 
              variant="contained" 
              onClick={handleDeleteItem}
              sx={{ backgroundColor: '#758173', color: '#C5EFCB' }} // Muted green, Light green
            >
              Delete
            </Button>
          </Box>
        </Modal>

        {/* Inventory Grid */}
        <Stack 
          width="80%" 
          direction="row" 
          flexWrap="wrap" 
          justifyContent="center" 
          gap={2}
        >
          {filteredInventory.map(({ name, quantity, image }) => (
            <Box 
              key={name} 
              width="200px" 
              height="250px" 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="space-between" 
              bgcolor="#C6DEC6" // Pale green
              p={2}
              borderRadius={2}
            >
              {/* Item Image */}
              {image && <Image src={image} alt={name} width={100} height={100} objectFit="cover" />}
              {/* Item Name */}
              <Typography variant='h6' color="#020402" textAlign="center"> {/* Nearly black */}
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              {/* Item Quantity */}
              <Typography variant='h6' color="#020402" textAlign="center"> {/* Nearly black */}
                Quantity: {quantity}
              </Typography>
              {/* Add/Remove Buttons */}
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => addItem(name)}
                  sx={{ backgroundColor: '#758173', color: '#C5EFCB', mt: 2 }} // Muted green, Light green
                >
                  Add
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => removeItem(name)}
                  sx={{ backgroundColor: '#758173', color: '#C5EFCB', mt: 2 }} // Muted green, Light green
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    );
}
