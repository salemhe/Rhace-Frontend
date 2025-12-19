import React, { useState } from 'react'
import { MenuItem } from './PreSelectMeal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Minus, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'

const MenuReservation = ({ menuFiltered, setMenuItems, menuItems }) => {
      const [index, setIndex] = useState(3)
    
      const handleQuantityChange = (id, change) => {
        setMenuItems(
          menuItems.map((item) => {
            if (item._id === id) {
              const newQuantity = Math.max(1, item.quantity + change);
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        );
      };
    
      const handleSpecialRequestChange = (id, value) => {
        setMenuItems(
          menuItems.map((item) => {
            if (item._id === id) {
              return { ...item, specialRequest: value };
            }
            return item;
          })
        );
      };
    
      const handleSelectionChange = (id) => {
        setMenuItems(
          menuItems.map((item) => {
            if (item._id === id) {
              return { ...item, selected: !item.selected };
            }
            return item;
          })
        );
      };

  return (
    <>
    <div className="space-y-4 mb-6">
          {menuFiltered.length > 0
            ? menuFiltered.slice(0, index).map((item, i) => (
                <Card
                  key={i}
                  className={`overflow-hidden ${
                    item.selected ? "border-teal-500" : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                        <img
                          src={item.itemImage || "/placeholder.svg"}
                          alt={item.name}
                          className="object-contain size-full"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                            <p className="font-medium mt-2">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer ${
                              item.selected
                                ? "bg-teal-600 border-teal-600 text-white"
                                : "border-gray-300"
                            }`}
                            onClick={() => handleSelectionChange(item._id)}
                          >
                            {item.selected && <Check className="h-4 w-4" />}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleQuantityChange(item._id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleQuantityChange(item._id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Special request (e.g. no garlic)"
                              value={item.specialRequest}
                              onChange={(e) =>
                                handleSpecialRequestChange(
                                  item._id,
                                  e.target.value
                                )
                              }
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : "not found"}
        </div>

        {/* {menuFiltered.length > 3 && index !>= menuFiltered.length && ( */}
          <div className="flex justify-center mb-6">
            <Button
              variant="ghost"
              className="text-teal-600 flex items-center gap-1"
              onClick={() => setIndex(index + 3)}
            >
              Show more{" "}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_268_3498)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.29279 6.29259C6.48031 6.10512 6.73462 5.99981 6.99979 5.99981C7.26495 5.99981 7.51926 6.10512 7.70679 6.29259L11.9998 10.5856L16.2928 6.29259C16.385 6.19708 16.4954 6.1209 16.6174 6.06849C16.7394 6.01608 16.8706 5.9885 17.0034 5.98734C17.1362 5.98619 17.2678 6.01149 17.3907 6.06177C17.5136 6.11205 17.6253 6.18631 17.7192 6.2802C17.8131 6.37409 17.8873 6.48574 17.9376 6.60864C17.9879 6.73154 18.0132 6.86321 18.012 6.99599C18.0109 7.12877 17.9833 7.25999 17.9309 7.382C17.8785 7.504 17.8023 7.61435 17.7068 7.70659L12.7068 12.7066C12.5193 12.8941 12.265 12.9994 11.9998 12.9994C11.7346 12.9994 11.4803 12.8941 11.2928 12.7066L6.29279 7.70659C6.10532 7.51907 6 7.26476 6 6.99959C6 6.73443 6.10532 6.48012 6.29279 6.29259ZM6.29279 12.2926C6.48031 12.1051 6.73462 11.9998 6.99979 11.9998C7.26495 11.9998 7.51926 12.1051 7.70679 12.2926L11.9998 16.5856L16.2928 12.2926C16.4814 12.1104 16.734 12.0096 16.9962 12.0119C17.2584 12.0142 17.5092 12.1194 17.6946 12.3048C17.88 12.4902 17.9852 12.741 17.9875 13.0032C17.9897 13.2654 17.8889 13.518 17.7068 13.7066L12.7068 18.7066C12.5193 18.8941 12.265 18.9994 11.9998 18.9994C11.7346 18.9994 11.4803 18.8941 11.2928 18.7066L6.29279 13.7066C6.10532 13.5191 6 13.2648 6 12.9996C6 12.7344 6.10532 12.4801 6.29279 12.2926Z"
                    fill="#0A6C6D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_268_3498">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Button>
          </div>
        {/* )} */}
    </>
  )
}

export default MenuReservation