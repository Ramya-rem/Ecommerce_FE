import { createContext, useContext, useState, useEffect } from "react"

const OrderContext = createContext()

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Sample orders for demonstration
  const sampleOrders = [
    {
      id: "ORD-1703123456789",
      orderDate: "2024-01-15T10:30:00.000Z",
      status: "delivered",
      items: [
        {
          id: 1,
          name: "Chocolate Croissant",
          price: 4.99,
          quantity: 2,
          image: "/placeholder.svg?height=60&width=60&text=Croissant",
        },
        {
          id: 2,
          name: "Blueberry Muffin",
          price: 3.49,
          quantity: 1,
          image: "/placeholder.svg?height=60&width=60&text=Muffin",
        },
      ],
      total: 13.47,
      deliveryAddress: {
        name: "John Doe",
        address: "123 Main St, City, State 12345",
        phone: "+1 234-567-8900",
      },
      paymentMethod: "Credit Card",
      estimatedDelivery: "2024-01-16T14:00:00.000Z",
      actualDelivery: "2024-01-16T13:45:00.000Z",
      trackingNumber: "TRK123456789",
    },
    {
      id: "ORD-1703123456790",
      orderDate: "2024-01-20T15:45:00.000Z",
      status: "shipped",
      items: [
        {
          id: 3,
          name: "Red Velvet Cake",
          price: 24.99,
          quantity: 1,
          image: "/placeholder.svg?height=60&width=60&text=Cake",
        },
      ],
      total: 24.99,
      deliveryAddress: {
        name: "Jane Smith",
        address: "456 Oak Ave, City, State 12345",
        phone: "+1 234-567-8901",
      },
      paymentMethod: "UPI",
      estimatedDelivery: "2024-01-22T16:00:00.000Z",
      trackingNumber: "TRK123456790",
    },
    {
      id: "ORD-1703123456791",
      orderDate: "2024-01-25T09:15:00.000Z",
      status: "processing",
      items: [
        {
          id: 4,
          name: "Vanilla Cupcakes",
          price: 2.99,
          quantity: 6,
          image: "/placeholder.svg?height=60&width=60&text=Cupcake",
        },
        {
          id: 5,
          name: "Chocolate Chip Cookies",
          price: 1.99,
          quantity: 12,
          image: "/placeholder.svg?height=60&width=60&text=Cookie",
        },
      ],
      total: 41.82,
      deliveryAddress: {
        name: "Mike Johnson",
        address: "789 Pine St, City, State 12345",
        phone: "+1 234-567-8902",
      },
      paymentMethod: "Cash on Delivery",
      estimatedDelivery: "2024-01-27T12:00:00.000Z",
    },
  ]

  // Load orders on mount
  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Try to get orders from localStorage first
      const savedOrders = localStorage.getItem("userOrders")
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      } else {
        // Use sample orders if no saved orders
        setOrders(sampleOrders)
        localStorage.setItem("userOrders", JSON.stringify(sampleOrders))
      }
    } catch (err) {
      console.error("Error loading orders:", err)
      setError(err.message)
      // Fallback to sample orders
      setOrders(sampleOrders)
    } finally {
      setLoading(false)
    }
  }

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("userOrders", JSON.stringify(orders))
    }
  }, [orders])

  const addOrder = async (orderData) => {
    try {
      setLoading(true)
      setError(null)

      const newOrder = {
        id: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: "processing",
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        ...orderData,
      }

      setOrders((prevOrders) => [newOrder, ...prevOrders])
      return newOrder
    } catch (err) {
      console.error("Error creating order:", err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true)
      setError(null)

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                ...(newStatus === "delivered" && { actualDelivery: new Date().toISOString() }),
                ...(newStatus === "shipped" && !order.trackingNumber && { trackingNumber: `TRK${Date.now()}` }),
              }
            : order,
        ),
      )
    } catch (err) {
      console.error("Error updating order status:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId)
  }

  const getOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        addOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByStatus,
        loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
